import { promises as fs } from 'fs';
import * as path from 'path';

const commands = [];
const nonCommands = [ 'Command.ts', 'commands.ts', 'index.ts', 'decorators' ];

export default {
  commands,

  async populate(): Promise<void> {
    for (const category of await fs.readdir(__dirname)) {
      if (nonCommands.includes(category)) {
        continue;
      }

      for (const filename of await fs.readdir(path.resolve(__dirname, category))) {
        const mdl = await import(path.join(__dirname, category, filename));
        commands.push([category, mdl.default]);
      }
    }
  }
};
