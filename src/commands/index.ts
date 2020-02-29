import { ICommand } from './Command';
import commands from './commands';

const commandMap: Map<string, ICommand> = new Map();

commands.populate()
  .then(() => {
    for (const [ category, CommandClass ] of commands.commands) {
      const command = new CommandClass() as ICommand;
    
      if (!command.onLoad) {
        command.onLoad = (): void => void 0;
      }
      if (!command.category) {
        command.category = category;
      }
      if (!command.aliases) {
        command.aliases = [];
      }
      if (!command.help) {
        command.help = '';
      }

      command.loaded = false;
    
      commandMap.set(command.name, command);
      for (const alias of command.aliases) {
        commandMap.set(alias, command);
      }
    }
  });

export { commandMap as commands };
export * from './Command';
