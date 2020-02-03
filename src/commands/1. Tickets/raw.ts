import ViewCommand from './view';
import { CommandParams, CommandOutput } from '../Command';

export default class RawCommand extends ViewCommand {
  name = 'raw';
  help = '<ticket ID>';

  public execute({ args, ...rest }: CommandParams): Promise<CommandOutput> {
    args.push('--raw');
    return super.execute({ args, ...rest });
  }
}
