import { EmbedOptions } from 'eris';
import { Command, Context, CommandOutput } from './Command';
import { Emojis } from '../Constants';

export default class HelpCommand implements Command {
  private renderedResult: EmbedOptions;

  name = 'help';

  public onLoad({ client, commands }: Context): void {
    this.renderedResult = {
      title: 'Meow! I\'m Gucci',
      description: `Hewwo, ime gucci and ime secretary for the Devs, meow ${Emojis.GUCCI_ROAR}\n\n${
        [ ...commands.values() ]
          .filter((command, index, self) => self.indexOf(command) === index)
          .map(command => `\`${client.opts.prefix}${command.name}${command.help ? ` ${command.help}` : ''}\``)
          .join('\n')
      }`
    };
  }

  public execute(): CommandOutput {
    return this.renderedResult;
  }
}
