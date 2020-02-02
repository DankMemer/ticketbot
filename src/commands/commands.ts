import { promises as fs } from 'fs';
import * as path from 'path';

const commands = [];
const nonCommands = [ 'Command.ts', 'commands.ts', 'index.ts', 'decorators' ];

export default {
  commands,

  async populate(): Promise<void> {
    for (const filename of await fs.readdir(__dirname)) {
      if (!nonCommands.includes(filename)) {
        const mdl = await import(path.join(__dirname, filename));
        commands.push(mdl.default);
      }
    }
  }
};
