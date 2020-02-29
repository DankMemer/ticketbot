import { ICommand, CommandParams, CommandOutput, Context } from '../Command';
import { Restricted } from '../decorators';
import { inspect } from 'util';
import { codeblock, escapeRegex } from '../../lib/util';
import { config } from '../../';

@Restricted({ userIDs: config.owners })
export default class EvalCommand implements ICommand {
  name = 'eval';
  aliases = ['e'];
  help = 'up the shut fuck';
  raw = true;

  credentialRegex: RegExp;

  public onLoad({ client }: Context): void {
    this.credentialRegex = RegExp(
      Object.values(client.opts.keys)
        .map(escapeRegex)
        .join('|'),
      'gi'
    );
  }

  public async execute({ msg, args, ...rest }: CommandParams): Promise<CommandOutput> {
    const depthIdx = args.findIndex(arg => arg.startsWith('--depth'));
    let depth = depthIdx === -1
      ? 1
      : +args.splice(depthIdx, 1)[0].split('=')[1];
    const input = args.join(' ');

    if (!input) {
      return 'missing args';
    }

    let res;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ctx = { msg, ...rest };
      res = await eval(
        input.indexOf('await') > 0
          ? `(async () => { ${input} })()`
          : input
      );
    } catch (err) {
      res = err;
    }

    let output;
    if (typeof res === 'string') {
      output = res;
    } else {
      do {
        output = inspect(res, { depth: depth-- });
      } while (depth >= 0 && output.length > 1950);
    }

    if (output.length > 1950) {
      output = output.slice(0, 1950) + ' ...';
    }

    return codeblock(output || '\n', 'javascript')
      .replace(this.credentialRegex, 'i think the fuck not you trick ass bitch');
  }
}
