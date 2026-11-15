import * as fs from 'node:fs';
import * as path from 'node:path';

function toPascalCase(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase()).replace(/[\s_-]+/g, '');
}

export async function makeModuleCommand(rawModuleName: string): Promise<void> {
  const moduleName = rawModuleName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const pascalName = toPascalCase(moduleName);
  const targetDir = path.resolve(process.cwd(), 'app/modules', moduleName);

  if (fs.existsSync(targetDir)) {
    // eslint-disable-next-line no-console
    console.warn(`Module '${moduleName}' already exists at ${targetDir}`);
    return;
  }

  // Create role directories
  const roles = [
    'controllers',
    'models',
    'repositories',
    'services',
    'validators',
    'serializers',
    'policies',
    'exceptions',
    'routes',
    'providers',
  ];

  for (const role of roles) {
    fs.mkdirSync(path.join(targetDir, role), { recursive: true });
  }

  // Create files matching naming conventions
  fs.writeFileSync(
    path.join(targetDir, 'models', `${moduleName}.ts`),
    `export interface ${pascalName}Model {\n  id: string;\n  createdAt: Date;\n  updatedAt: Date;\n}\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'validators', `${moduleName}.ts`),
    `import { z } from 'zod';\n\nexport const list${pascalName}QuerySchema = z.object({\n  page: z.coerce.number().default(1),\n  pageSize: z.coerce.number().default(20),\n});\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'serializers', `${moduleName}_serializer.ts`),
    `import type { ${pascalName}Model } from '../models/${moduleName}.js';\n\nexport class ${pascalName}Serializer {\n  serialize(model: ${pascalName}Model) {\n    return { id: model.id, createdAt: model.createdAt.toISOString() };\n  }\n}\nexport const ${moduleName}Serializer = new ${pascalName}Serializer();\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'exceptions', `${moduleName}_exception.ts`),
    `import { AppException } from '#exceptions/app_exception';\n\nexport class ${pascalName}Exception extends AppException {}\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'policies', `${moduleName}_policy.ts`),
    `import type { ${pascalName}Model } from '../models/${moduleName}.js';\n\nexport class ${pascalName}Policy {\n  canView(_model: ${pascalName}Model): boolean {\n    return true;\n  }\n}\nexport const ${moduleName}Policy = new ${pascalName}Policy();\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'repositories', `${moduleName}_repository.ts`),
    `import type { ${pascalName}Model } from '../models/${moduleName}.js';\n\nexport class ${pascalName}Repository {\n  async findById(id: string): Promise<${pascalName}Model | null> {\n    return null;\n  }\n}\nexport const ${moduleName}Repository = new ${pascalName}Repository();\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'services', `${moduleName}_service.ts`),
    `import { ${pascalName}Repository, ${moduleName}Repository } from '../repositories/${moduleName}_repository.js';\nimport type { ${pascalName}Model } from '../models/${moduleName}.js';\n\nexport class ${pascalName}Service {\n  constructor(private readonly repo: ${pascalName}Repository = ${moduleName}Repository) {}\n\n  async getById(id: string): Promise<${pascalName}Model | null> {\n    return this.repo.findById(id);\n  }\n}\nexport const ${moduleName}Service = new ${pascalName}Service();\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'controllers', `${moduleName}_controller.ts`),
    `import type { HttpContext } from '#infrastructure/http/http_context';\nimport { ${pascalName}Service, ${moduleName}Service } from '../services/${moduleName}_service.js';\nimport { ${pascalName}Serializer, ${moduleName}Serializer } from '../serializers/${moduleName}_serializer.js';\n\nexport class ${pascalName}Controller {\n  constructor(\n    private readonly service: ${pascalName}Service = ${moduleName}Service,\n    private readonly serializer: ${pascalName}Serializer = ${moduleName}Serializer\n  ) {}\n\n  index = async (ctx: HttpContext): Promise<Response> => {\n    return ctx.response.ok(ctx.c, []);\n  };\n}\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'controllers', `admin_${moduleName}_controller.ts`),
    `import type { HttpContext } from '#infrastructure/http/http_context';\nimport { ${pascalName}Service, ${moduleName}Service } from '../services/${moduleName}_service.js';\n\nexport class Admin${pascalName}Controller {\n  constructor(private readonly service: ${pascalName}Service = ${moduleName}Service) {}\n\n  store = async (ctx: HttpContext): Promise<Response> => {\n    return ctx.response.created(ctx.c, { created: true });\n  };\n}\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'routes', 'public.ts'),
    `import type { Router } from '#infrastructure/http/router';\nimport { ${pascalName}Controller } from '../controllers/${moduleName}_controller.js';\n\nexport function register${pascalName}PublicRoutes(router: Router): void {\n  const r = router.forModule('${moduleName}');\n  r.get('/${moduleName}', [${pascalName}Controller, 'index'])\n    .as('${moduleName}.index')\n    .docs({ summary: 'List ${moduleName}', tags: ['${pascalName}'] });\n}\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'routes', 'admin.ts'),
    `import type { Router } from '#infrastructure/http/router';\nimport { Admin${pascalName}Controller } from '../controllers/admin_${moduleName}_controller.js';\n\nexport function register${pascalName}AdminRoutes(router: Router): void {\n  const r = router.forModule('${moduleName}');\n  r.post('/admin/${moduleName}', [Admin${pascalName}Controller, 'store'])\n    .as('admin.${moduleName}.store')\n    .docs({ summary: 'Create ${moduleName}', tags: ['${pascalName}'] });\n}\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'routes', 'index.ts'),
    `export * from './public.js';\nexport * from './admin.js';\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'providers', `${moduleName}_provider.ts`),
    `import { container } from '#infrastructure/container/container';\nimport { ${pascalName}Service } from '../services/${moduleName}_service.js';\nimport { ${pascalName}Repository } from '../repositories/${moduleName}_repository.js';\nimport { ${pascalName}Controller } from '../controllers/${moduleName}_controller.js';\nimport { Admin${pascalName}Controller } from '../controllers/admin_${moduleName}_controller.js';\n\nexport class ${pascalName}Provider {\n  register(): void {\n    const mod = container.forModule('${moduleName}');\n    mod.singleton(${pascalName}Repository, () => new ${pascalName}Repository());\n    mod.singleton(${pascalName}Service, () => new ${pascalName}Service(mod.make(${pascalName}Repository)));\n    mod.bind(${pascalName}Controller, () => new ${pascalName}Controller(mod.make(${pascalName}Service)));\n    mod.bind(Admin${pascalName}Controller, () => new Admin${pascalName}Controller(mod.make(${pascalName}Service)));\n  }\n}\nexport const ${moduleName}Provider = new ${pascalName}Provider();\n`
  );

  fs.writeFileSync(
    path.join(targetDir, 'README.md'),
    `# ${pascalName} Module\n\n## Purpose\nManages ${moduleName} domain entities and HTTP endpoints.\n\n## Owned Models\nSee docs/architecture/module-ownership.md.\n\n## Endpoints\n- GET /api/v1/${moduleName}\n- POST /api/v1/admin/${moduleName}\n`
  );

  // eslint-disable-next-line no-console
  console.log(`Module '${moduleName}' successfully scaffolded at app/modules/${moduleName}`);
}
