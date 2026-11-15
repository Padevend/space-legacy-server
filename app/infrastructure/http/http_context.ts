import type { Context } from 'hono';
import type { AuthenticatedUser } from '#contracts/auth_contract';
import * as ResponseHelper from './response.js';

export class HttpContext {
  public readonly response = ResponseHelper;

  constructor(
    public readonly c: Context,
    public readonly params: Record<string, string> = {},
    public readonly query: Record<string, any> = {},
    public readonly body: any = undefined
  ) {}

  get req() {
    return this.c.req;
  }

  get res() {
    return this.c.res;
  }

  get auth(): { user: AuthenticatedUser } | undefined {
    const user = this.c.get('user') as AuthenticatedUser | undefined;
    return user ? { user } : undefined;
  }

  get user(): AuthenticatedUser | undefined {
    return this.c.get('user') as AuthenticatedUser | undefined;
  }

  get userId(): string | undefined {
    return (this.c.get('userId') as string) || this.user?.userId;
  }

  get requestId(): string {
    return (this.c.get('requestId') as string) || '';
  }

  get clientIp(): string {
    return (this.c.get('clientIp') as string) || '127.0.0.1';
  }

  get<T = any>(key: string): T {
    return this.c.get(key as any);
  }

  set(key: string, value: any): void {
    this.c.set(key as any, value);
  }

  header(name: string, value: string): void {
    this.c.header(name, value);
  }

  json(data: any, status?: any): Response {
    return this.c.json(data, status);
  }
}
