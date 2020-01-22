import UpdateCommand from './update';
import { CommandParams, CommandOutput } from './Command';

export default class RawCommand extends UpdateCommand {
  name = 'append';
  help = '<ticket ID>';

  public execute({ args, ...rest }: CommandParams): Promise<CommandOutput> {
    args.push('--append');
    return super.execute({ args, ...rest });
  }
}
