#!/usr/bin/env node
import { Command } from 'commander';
import { logger } from '#infrastructure/logger/logger';

const program = new Command();

program.name('ace').description('SPACE LEGACY Backend Command Line Interface').version('1.0.0');

program
  .command('routes:list')
  .description('List and document all registered API routes')
  .action(async () => {
    const { routesListCommand } = await import('#commands/routes_list');
    await routesListCommand();
  });

program
  .command('docs:generate')
  .description('Generate OpenAPI specifications and verify documentation consistency')
  .action(async () => {
    const { docsGenerateCommand } = await import('#commands/docs_generate');
    await docsGenerateCommand();
  });

program
  .command('ingest:bulk <directory>')
  .description('Bulk ingest equipment bundles from data-processing results')
  .option('--dry-run', 'Validate bundle data without persisting to database', false)
  .action(async (directory: string, options: { dryRun?: boolean }) => {
    const { ingestBulkCommand } = await import('#commands/ingest_bulk');
    await ingestBulkCommand(directory, { dryRun: Boolean(options.dryRun) });
  });

program
  .command('user:create-admin')
  .description('Create an administrator or editor back-office account')
  .option('-e, --email <email>', 'Administrator email address')
  .option('-p, --password <password>', 'Administrator password')
  .action(async (options: { email?: string; password?: string }) => {
    const { createAdminCommand } = await import('#commands/create_admin');
    await createAdminCommand(options);
  });

program
  .command('db:seed')
  .description('Seed database with fixtures')
  .action(async () => {
    const { dbSeedCommand } = await import('#commands/db_seed');
    await dbSeedCommand();
  });

program
  .command('make:module <name>')
  .description('Scaffold a complete MVC module slice')
  .action(async (name: string) => {
    const { makeModuleCommand } = await import('#commands/make_module');
    await makeModuleCommand(name);
  });

program.parseAsync(process.argv).catch((err) => {
  logger.error({ err }, 'Ace command failed with unhandled exception.');
  process.exit(1);
});
