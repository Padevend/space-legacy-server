import { Hono, type Context, type MiddlewareHandler } from 'hono';
import { type ZodType } from 'zod';
import { container } from '#infrastructure/container/container';
import { HttpContext } from './http_context.js';
import { mapZodError } from '#exceptions/zod_error_mapper';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RouteValidators {
  params?: ZodType<any>;
  query?: ZodType<any>;
  body?: ZodType<any>;
}

export interface RouteDocs {
  summary?: string;
  description?: string;
  tags?: string[];
  responses?: Record<number, any>;
}

export type ControllerActionTuple = [any, string];
export type RouteHandler = ControllerActionTuple | ((c: Context) => any) | ((ctx: HttpContext) => any);

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  name?: string | undefined;
  moduleName?: string | undefined;
  handler: RouteHandler;
  middlewares: (MiddlewareHandler | any)[];
  validators?: RouteValidators | undefined;
  docsMetadata?: RouteDocs | undefined;
  matchers?: Record<string, RegExp | string> | undefined;
}

export class RouteBuilder {
  constructor(
    public readonly def: RouteDefinition,
    private readonly registry: RouteRegistry
  ) {}

  as(name: string): this {
    if (this.registry.hasName(name)) {
      throw new Error(`Duplicate route name: '${name}'`);
    }
    this.def.name = name;
    this.registry.registerName(name, this.def);
    return this;
  }

  where(param: string, matcher: RegExp | string): this {
    this.def.matchers = this.def.matchers || {};
    this.def.matchers[param] = matcher;
    return this;
  }

  validate(validators: RouteValidators): this {
    this.def.validators = validators;
    return this;
  }

  docs(metadata: RouteDocs): this {
    this.def.docsMetadata = metadata;
    return this;
  }

  use(...middlewares: any[]): this {
    this.def.middlewares.push(...middlewares.flat());
    return this;
  }
}

export class ResourceBuilder {
  constructor(public readonly routes: RouteBuilder[]) {}

  use(pattern: string, ...middlewares: any[]): this {
    for (const r of this.routes) {
      if (pattern === '*' || pattern === r.def.path) {
        r.use(...middlewares);
      }
    }
    return this;
  }
}

export class RouteRegistry {
  private routes: RouteDefinition[] = [];
  private names = new Map<string, RouteDefinition>();
  private methodPaths = new Set<string>();

  add(def: RouteDefinition): void {
    const key = `${def.method} ${def.path}`;
    if (this.methodPaths.has(key)) {
      throw new Error(`Duplicate route: ${key}`);
    }
    this.methodPaths.add(key);
    this.routes.push(def);
  }

  hasName(name: string): boolean {
    return this.names.has(name);
  }

  registerName(name: string, def: RouteDefinition): void {
    this.names.set(name, def);
  }

  getAll(): readonly RouteDefinition[] {
    return this.routes;
  }

  clear(): void {
    this.routes = [];
    this.names.clear();
    this.methodPaths.clear();
  }
}

export class RouteGroupBuilder {
  private prefixPath = '';
  private middlewares: any[] = [];

  constructor(
    private readonly router: Router,
    private readonly callback: () => void
  ) {}

  prefix(prefix: string): this {
    this.prefixPath = prefix;
    return this;
  }

  use(...middlewares: any[]): this {
    this.middlewares.push(...middlewares.flat());
    return this;
  }

  execute(): void {
    this.router.enterGroup(this.prefixPath, this.middlewares);
    this.callback();
    this.router.leaveGroup();
  }
}

export class Router {
  protected registry: RouteRegistry;
  protected currentPrefixStack: string[] = [];
  protected currentMiddlewareStack: any[][] = [];
  protected currentModuleName?: string | undefined;

  constructor(registry?: RouteRegistry, moduleName?: string) {
    this.registry = registry ?? new RouteRegistry();
    this.currentModuleName = moduleName;
  }

  matchers = {
    id: () => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    uuid: () => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    slug: () => /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
    idOrSlug: () => /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-z0-9]+(?:-[a-z0-9]+)*)$/i,
  };

  forModule(moduleName: string): Router {
    const scoped = new Router(this.registry, moduleName);
    scoped.currentPrefixStack = [...this.currentPrefixStack];
    scoped.currentMiddlewareStack = [...this.currentMiddlewareStack];
    return scoped;
  }

  enterGroup(prefix: string, middlewares: any[]): void {
    this.currentPrefixStack.push(prefix);
    this.currentMiddlewareStack.push(middlewares);
  }

  leaveGroup(): void {
    this.currentPrefixStack.pop();
    this.currentMiddlewareStack.pop();
  }

  group(callback: () => void): RouteGroupBuilder {
    const builder = new RouteGroupBuilder(this, callback);
    // Queue execution for next tick or when chained
    queueMicrotask(() => {
      builder.execute();
    });
    return builder;
  }

  named<T extends Record<string, any>>(middlewares: T): T {
    return middlewares;
  }

  private buildPath(path: string): string {
    const fullPrefix = this.currentPrefixStack.join('');
    const cleanPrefix = fullPrefix.endsWith('/') ? fullPrefix.slice(0, -1) : fullPrefix;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanPrefix}${cleanPath}` || '/';
  }

  private buildMiddlewares(routeMiddlewares: any[] = []): any[] {
    const inherited = this.currentMiddlewareStack.flat();
    return [...inherited, ...routeMiddlewares];
  }

  addRoute(method: HttpMethod, path: string, handler: RouteHandler): RouteBuilder {
    const fullPath = this.buildPath(path);
    const middlewares = this.buildMiddlewares();

    const def: RouteDefinition = {
      method,
      path: fullPath,
      moduleName: this.currentModuleName,
      handler,
      middlewares,
    };

    this.registry.add(def);
    return new RouteBuilder(def, this.registry);
  }

  get(path: string, handler: RouteHandler): RouteBuilder {
    return this.addRoute('GET', path, handler);
  }

  post(path: string, handler: RouteHandler): RouteBuilder {
    return this.addRoute('POST', path, handler);
  }

  put(path: string, handler: RouteHandler): RouteBuilder {
    return this.addRoute('PUT', path, handler);
  }

  patch(path: string, handler: RouteHandler): RouteBuilder {
    return this.addRoute('PATCH', path, handler);
  }

  delete(path: string, handler: RouteHandler): RouteBuilder {
    return this.addRoute('DELETE', path, handler);
  }

  resource(resourceName: string, controller: any): ResourceBuilder {
    const cleanName = resourceName.replace(/^\//, '');
    const routes: RouteBuilder[] = [
      this.get(`/${cleanName}`, [controller, 'index']).as(`${cleanName}.index`),
      this.post(`/${cleanName}`, [controller, 'store']).as(`${cleanName}.store`),
      this.get(`/${cleanName}/:id`, [controller, 'show']).as(`${cleanName}.show`),
      this.put(`/${cleanName}/:id`, [controller, 'update']).as(`${cleanName}.update`),
      this.delete(`/${cleanName}/:id`, [controller, 'destroy']).as(`${cleanName}.destroy`),
    ];
    return new ResourceBuilder(routes);
  }

  getRoutes(): readonly RouteDefinition[] {
    return this.registry.getAll();
  }

  toHono(app: Hono): Hono {
    for (const def of this.registry.getAll()) {
      const { method, path, handler, middlewares, validators, moduleName } = def;

      const honoHandler = async (c: Context) => {
        let validatedParams: Record<string, string> = {};
        let validatedQuery: Record<string, any> = {};
        let validatedBody: any = undefined;

        if (validators) {
          if (validators.params) {
            const rawParams = c.req.param();
            const res = validators.params.safeParse(rawParams);
            if (!res.success) throw mapZodError(res.error, 'params');
            validatedParams = res.data;
          } else {
            validatedParams = c.req.param();
          }

          if (validators.query) {
            const rawQuery = c.req.query();
            const res = validators.query.safeParse(rawQuery);
            if (!res.success) throw mapZodError(res.error, 'query');
            validatedQuery = res.data;
          } else {
            validatedQuery = c.req.query();
          }

          if (validators.body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            let rawBody = {};
            try {
              rawBody = await c.req.json();
            } catch {
              rawBody = {};
            }
            const res = validators.body.safeParse(rawBody);
            if (!res.success) throw mapZodError(res.error, 'body');
            validatedBody = res.data;
          }
        } else {
          validatedParams = c.req.param();
          validatedQuery = c.req.query();
        }

        const ctx = new HttpContext(c, validatedParams, validatedQuery, validatedBody);

        if (Array.isArray(handler)) {
          const [ControllerClass, action] = handler;
          const containerToUse = moduleName ? container.forModule(moduleName) : container;
          let instance: any;
          try {
            instance = containerToUse.make(ControllerClass);
          } catch {
            instance = new ControllerClass();
          }

          if (typeof instance[action] !== 'function') {
            throw new Error(`Controller action '${action}' not found on ${ControllerClass.name || 'Controller'}`);
          }

          return await instance[action](ctx);
        }

        if (typeof handler === 'function') {
          return await (handler as any)(ctx);
        }

        throw new Error(`Invalid handler for route ${method} ${path}`);
      };

      const routeMiddlewares = [...middlewares, honoHandler];

      const honoAny = app as any;
      switch (method) {
        case 'GET':
          honoAny.get(path, ...routeMiddlewares);
          break;
        case 'POST':
          honoAny.post(path, ...routeMiddlewares);
          break;
        case 'PUT':
          honoAny.put(path, ...routeMiddlewares);
          break;
        case 'PATCH':
          honoAny.patch(path, ...routeMiddlewares);
          break;
        case 'DELETE':
          honoAny.delete(path, ...routeMiddlewares);
          break;
      }
    }

    return app;
  }
}

export const router = new Router();
export default router;
