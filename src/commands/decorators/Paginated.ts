import { CommandExecutePropertyDescriptor } from '.';
import { EmbedOptions } from 'eris';
import { ICommand } from '../Command';
import { paginate } from '../../lib/util';

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
