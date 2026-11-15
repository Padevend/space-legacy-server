export interface AdonisConfig {
  typescript: boolean;
  providers: string[];
  preloads: string[];
  commands: string[];
}

const adonisrc: AdonisConfig = {
  typescript: true,
  providers: ['#providers/app_provider', '#providers/modules_provider'],
  preloads: ['#start/env', '#start/kernel', '#start/routes'],
  commands: [
    '#commands/routes_list',
    '#commands/docs_generate',
    '#commands/ingest_bulk',
    '#commands/create_admin',
    '#commands/db_seed',
    '#commands/make_module',
  ],
};

export default adonisrc;
