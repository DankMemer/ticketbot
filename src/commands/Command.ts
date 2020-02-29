import { Message, EmbedOptions } from 'eris';
import TicketBot from '../Client';
import Database from '../Database';
import { Awaitable } from '../lib/util';

export type Context = {
  client: TicketBot;
  commands: Map<string, ICommand>;
  db: Database;
};

export type CommandParams = {
  msg: Message;
  args: string[];
} & Context;

export type CommandOutput = string | EmbedOptions;

export interface ICommand {
  new?(): ICommand;

  name: string;
  category?: string;
  aliases?: string[];
  help?: string;
  raw?: boolean;
  loaded?: boolean;

  execute(params?: CommandParams): Awaitable<CommandOutput>;
  onLoad?(params?: Context): void;
}
