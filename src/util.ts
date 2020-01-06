import { readFileSync } from 'fs';
import { resolve } from 'path';
import { TicketBotOptions } from './Client';
import { DatabaseConfig } from './Database';
import { Defaults } from './Constants';

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
} =>
  JSON.parse(readFileSync(resolve(__dirname, '..', 'config.json'), 'utf8'));

export const paginate = <T>(
  arr: T[],
  pageIndex: number,
  resultsPerPage: number = Defaults.RESULTS_PER_PAGE,
): T[] =>
  arr.slice(
    pageIndex * resultsPerPage,
    (pageIndex + 1) * resultsPerPage
  );

export type Awaitable<T> = Promise<T> | T;
