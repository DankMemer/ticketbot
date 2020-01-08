import { readFileSync } from 'fs';
import { resolve } from 'path';
import { TicketBotOptions } from './Client';
import { DatabaseConfig } from './Database';
import { Defaults, BAD_WORDS } from './Constants';

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

export const findBad = (input: string): string | null => {
  input = input.toLowerCase();

  for (const badWord of BAD_WORDS) {
    if (input.includes(badWord)) {
      return badWord;
    }
  }

  return null;
};

export const highlight = (input: string, segment: string): string => {
  return input.replace(
    RegExp(`(${segment})`, 'g'),
    (sub) => `[**__${sub}__**](https://\u200b "\u200b")`
  );
}

export type Awaitable<T> = Promise<T> | T;

const Pass = () => void 0;

