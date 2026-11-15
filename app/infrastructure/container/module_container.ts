import type { Container, Token } from './container.js';

export class ModuleContainer {
  constructor(
    private readonly root: Container,
    public readonly moduleName: string
  ) {}

  bind<T>(token: Token<T>, factory: (container: Container) => T): this {
    this.root.bind(token, factory, this.moduleName);
    return this;
  }

  singleton<T>(token: Token<T>, factory: (container: Container) => T): this {
    this.root.singleton(token, factory, this.moduleName);
    return this;
  }

  make<T>(token: Token<T>): T {
    const binding = this.root.getBinding(token);
    if (binding && binding.ownerModule && binding.ownerModule !== this.moduleName) {
      const tokenName =
        typeof token === 'symbol' ? token.description : typeof token === 'function' ? token.name : String(token);
      throw new Error(
        `Isolation violation: Module '${this.moduleName}' cannot resolve foreign token '${tokenName}' owned by module '${binding.ownerModule}'`
      );
    }
    return this.root.make(token);
  }

  has(token: Token): boolean {
    return this.root.has(token);
  }
}
