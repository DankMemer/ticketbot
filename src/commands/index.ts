import { Command } from './Command';
import * as commands from './commands';

const commandMap: Map<string, Command> = new Map();
for (const CommandClass of Object.values(commands)) {
  const command = new CommandClass() as Command;

  if (!command.onLoad) {
    command.onLoad = (): void => void 0;
  }

  if (!command.aliases) {
    command.aliases = [];
  }
  if (!command.help) {
    command.help = '';
  }

  commandMap.set(command.name, command);
  for (const alias of command.aliases) {
    commandMap.set(alias, command);
  }
}

export { commandMap as commands };
export * from './Command';
