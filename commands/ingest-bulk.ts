export async function ingestBulkCommand(directory: string, options: { dryRun: boolean }): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`Ingesting bundles from ${directory} (dryRun: ${options.dryRun})`);
}
