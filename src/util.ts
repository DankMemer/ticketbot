import { readFileSync } from 'fs';
import { resolve } from 'path';
import { TicketBotOptions } from './Client';
import { DatabaseConfig } from './Database';

export const dateToString = (time: Date): string =>
  new Date(time)
    .toString()
    .split(' ')
    .slice(1, 5)
    .join(' ');

export const randomInArray = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const loadConfig = (): {
  clientConfig: TicketBotOptions;
  dbConfig: DatabaseConfig;
} => JSON.parse(readFileSync(resolve(__dirname, '..', 'config.json'), 'utf8'));
