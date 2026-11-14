export interface AuthUser {
  userId: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
}

export interface AppVariables {
  requestId: string;
  clientIp: string;
  user?: AuthUser;
  userId?: string;
}

export type AppBindings = Record<string, unknown>;

export interface AppEnv {
  Bindings: AppBindings;
  Variables: AppVariables;
}
