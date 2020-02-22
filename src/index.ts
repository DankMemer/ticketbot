import { loadConfig } from './lib/util';
export const config = loadConfig();

import TicketBot from './Client';
new TicketBot(config).bootstrap();
