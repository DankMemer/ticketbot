import { Message, EmbedOptions } from 'eris';
import TicketBot from '../Client';
import Database from '../Database';
import { paginate, Awaitable } from '../util';

export type Context = {
  client: TicketBot;
  commands: Map<string, Command>;
  db: Database;
};

export type CommandParams = {
  msg: Message;
  args: string[];
} & Context;

export type CommandOutput = string | EmbedOptions;

export interface Command {
  new?(): Command;

  name: string;
  aliases?: string[];
  help?: string;

  execute(params?: CommandParams): Awaitable<CommandOutput>;
  onLoad?(params?: Context): void;
}

interface CommandExecutePropertyDescriptor extends PropertyDescriptor {
  value?: Command['execute'];
}

export const Paginated = ({ resultsPerPage, reversed }: { resultsPerPage: number; reversed: boolean }) =>
  (target: Command, _, descriptor: CommandExecutePropertyDescriptor): void => {
    const originalFunc = target.execute;
    descriptor.value = async ({ args, ...rest }): Promise<EmbedOptions> => {
      const result = await originalFunc.call(target, { args, ...rest }) as EmbedOptions;
      if (!result.fields) {
        return result;
      }

      const providedIndex = Number(args.shift()) - 1;
      const defaultIndex = (reversed ? Math.floor((result.fields.length - 1) / resultsPerPage) : 0);
      const pageIndex = isNaN(providedIndex) ?
        defaultIndex :
        providedIndex;

      result.footer = {
        text: `Page ${pageIndex + 1}/${Math.ceil((result.fields.length) / resultsPerPage)}`
      };
      result.fields = paginate(result.fields, pageIndex, resultsPerPage);

      return result;
    };
  };
