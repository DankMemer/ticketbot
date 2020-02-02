import { loadConfig } from './lib/util';
const { clientConfig, dbConfig } = loadConfig();
export const config = clientConfig;

import Database from './Database';
import TicketBot from './Client';

new TicketBot({
  ...clientConfig,
  db: new Database(dbConfig)
}).connect();
