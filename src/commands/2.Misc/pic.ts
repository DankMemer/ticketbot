import { ICommand, CommandOutput } from '../Command';

export default class PicCommand implements ICommand {
  name = 'pic';
  aliases = ['floof'];
  execute = (): CommandOutput => ({
    image: { url: 'https://hey-alex.nl/wp-content/uploads/2018/12/lil-pump-kerker.png' }
  });
}
