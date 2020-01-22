import { ICommand, CommandOutput } from './Command';
import { randomInArray } from '../lib/util';
import { CatPics, Emojis } from '../Constants';

export default class PicCommand implements ICommand {
  name = 'pic';
  aliases = ['floof'];
  execute = (): CommandOutput => ({
    title: randomInArray<string>(Object.values(Emojis)),
    image: { url: randomInArray<string>(CatPics) }
  });
}
