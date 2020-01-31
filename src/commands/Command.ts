import { Message, EmbedOptions } from 'eris';
import TicketBot from '../Client';
import Database from '../Database';
import { paginate, Awaitable } from '../lib/util';

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
  aliases?: string[];
  help?: string;
  raw?: boolean;

  execute(params?: CommandParams): Awaitable<CommandOutput>;
  onLoad?(params?: Context): void;
}

interface CommandExecutePropertyDescriptor extends PropertyDescriptor {
  value?: ICommand['execute'];
}

export const OwnerOnly = <T extends new (...args: any[]) => any>(Target: T) => {
  return class extends Target implements Partial<ICommand> {
    public execute({ client, msg, ...rest }: CommandParams): CommandOutput {
      if (!client.opts.owners.includes(msg.author.id)) {
        return 'locked to devs';
      }

      return super.execute({ client, msg, ...rest });
    }
  }
}

export const Paginated = ({ resultsPerPage, reversed }: { resultsPerPage: number; reversed: boolean }) =>
  (target: ICommand, _, descriptor: CommandExecutePropertyDescriptor): void => {
    const originalFunc = target.execute;
    descriptor.value = async ({ args, ...rest }): Promise<EmbedOptions> => {
      const providedIndex = (Number.isNaN(+args[args.length - 1]) || args[args.length - 1].length > 14)
        ? NaN
        : Number(args.pop()) - 1;
      const result = await originalFunc.call(target, { args, ...rest }) as EmbedOptions;
      if (!result.fields) {
        return result;
      }

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
