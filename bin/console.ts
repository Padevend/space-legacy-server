#!/usr/bin/env node
import { Command } from 'commander';
import { logger } from '../src/core/logger/index.js';

const program = new Command();

program.name('ace').description('SPACE LEGACY Backend Command Line Interface').version('1.0.0');

// Register commands
program
  .command('routes:list')
  .description('List and document all registered API routes')
  .action(async () => {
    const { routesListCommand } = await import('../commands/routes-list.js');
    await routesListCommand();
  });

program
  .command('docs:generate')
  .description('Generate OpenAPI specifications and verify documentation consistency')
  .action(async () => {
    const { docsGenerateCommand } = await import('../commands/docs-generate.js');
    await docsGenerateCommand();
  });

program
  .command('ingest:bulk <directory>')
  .description('Bulk ingest equipment bundles from data-processing results')
  .option('--dry-run', 'Validate bundle data without persisting to database', false)
  .action(async (directory: string, options: { dryRun?: boolean }) => {
    const { ingestBulkCommand } = await import('../commands/ingest-bulk.js');
    await ingestBulkCommand(directory, { dryRun: Boolean(options.dryRun) });
  });

program
  .command('user:create-admin')
  .description('Create an administrator or editor back-office account')
  .option('-e, --email <email>', 'Administrator email address')
  .option('-p, --password <password>', 'Administrator password')
  .action(async (options: { email?: string; password?: string }) => {
    const { createAdminCommand } = await import('../commands/create-admin.js');
    await createAdminCommand(options);
  });

program
  .command('export:public')
  .description('Generate a static JSON snapshot of public catalog data for frontend resilience')
  .action(async () => {
    const { exportPublicCommand } = await import('../commands/export-public.js');
    await exportPublicCommand();
  });

program.parseAsync(process.argv).catch((err) => {
  logger.error({ err }, 'Command failed with unhandled exception.');
  process.exit(1);
});
