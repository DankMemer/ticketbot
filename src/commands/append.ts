import UpdateCommand from './update';
import { CommandParams } from './Command';

export default class RawCommand extends UpdateCommand {
  name = 'append';
  help = '<ticket ID>';

  public execute({ args, ...rest }: CommandParams) {
    args.push('--append');
    return super.execute({ args, ...rest });
  }
}
