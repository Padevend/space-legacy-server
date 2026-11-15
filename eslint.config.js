export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        crypto: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        performance: 'readonly',
        NodeJS: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-restricted-properties': [
        'error',
        {
          property: '$queryRawUnsafe',
          message: 'Raw SQL via $queryRawUnsafe is strictly forbidden. Use Prisma.sql tagged templates only.',
        },
        {
          property: '$executeRawUnsafe',
          message: 'Raw SQL via $executeRawUnsafe is strictly forbidden. Use Prisma.sql tagged templates only.',
        },
      ],
    },
  },
  {
    ignores: ['build/**', 'dist/**', 'node_modules/**', 'docs/**', 'legacy/**', '.pnpm-store/**'],
  },
];
