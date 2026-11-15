import { ModuleContainer } from './module_container.js';

export type Token<T = any> = string | symbol | (new (...args: any[]) => T) | Function;

export interface Binding<T = any> {
  factory: (container: Container) => T;
  singleton: boolean;
  instance?: T | undefined;
  ownerModule?: string | undefined;
}

export class Container {
  private bindings = new Map<Token, Binding>();

  bind<T>(token: Token<T>, factory: (container: Container) => T, ownerModule?: string): this {
    this.bindings.set(token, {
      factory,
      singleton: false,
      ownerModule,
    });
    return this;
  }

  singleton<T>(token: Token<T>, factory: (container: Container) => T, ownerModule?: string): this {
    this.bindings.set(token, {
      factory,
      singleton: true,
      ownerModule,
    });
    return this;
  }

  has(token: Token): boolean {
    return this.bindings.has(token);
  }

  getBinding(token: Token): Binding | undefined {
    return this.bindings.get(token);
  }

  make<T>(token: Token<T>): T {
    const binding = this.bindings.get(token);
    if (!binding) {
      if (typeof token === 'function') {
        try {
          return new (token as new (container?: Container) => T)(this);
        } catch {
          return new (token as new () => T)();
        }
      }
      const tokenName = typeof token === 'symbol' ? token.description : String(token);
      throw new Error(`Container cannot resolve unbound token: ${tokenName}`);
    }

    if (binding.singleton) {
      if (binding.instance === undefined) {
        binding.instance = binding.factory(this);
      }
      return binding.instance;
    }

    return binding.factory(this);
  }

  forModule(moduleName: string): ModuleContainer {
    return new ModuleContainer(this, moduleName);
  }
}

export const container = new Container();
