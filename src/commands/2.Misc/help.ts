import { EmbedOptions } from 'eris';
import { ICommand, Context, CommandOutput } from '../Command';
import { unique } from '../../lib/util';

export default class HelpCommand implements ICommand {
  private renderedResult: EmbedOptions;

  name = 'help';

  public onLoad({ client, commands }: Context): void {
    const commandsArray = [ ...commands.values() ].filter(unique);
    const categories = commandsArray
      .map(command => command.category)
      .filter(unique)
      .sort();

    this.renderedResult = {
      fields: categories.map(category => ({
        name: `**${category}**`,
        value: commandsArray
          .filter(cmd => cmd.category === category)
          .map(cmd => `\`${client.opts.prefix}${cmd.name}${cmd.help ? ` ${cmd.help}` : ''}\``)
          .join('\n')
      }))
    };
  }

  public execute(): CommandOutput {
    return this.renderedResult;
  }
}
