import { ICommand, CommandParams, CommandOutput, OwnerOnly, Context } from './Command';
import { inspect } from 'util';
import { codeblock } from '../lib/util';

@OwnerOnly
export default class EvalCommand implements ICommand {
  name = 'eval';
  aliases = ['e'];
  help = 'go away';

  credentialRegex: RegExp;

  public onLoad({ client }: Context) {
    this.credentialRegex = RegExp(
      Object.values(client.opts.keys).join('|'),
      'gi'
    );
  }

  public async execute ({ msg, args, ...rest }: CommandParams): Promise<CommandOutput> {
    const depthIdx = args.findIndex(arg => arg.startsWith('--depth'));
    let depth = depthIdx === -1
      ? 2
      : +args.splice(depthIdx, 1)[0].split('=')[1]
    let input = args.join(' ');

    if (!input) {
      return 'missing args';
    }

    let res;
    try {
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
      } while (depth >= 0 && output.length > 1024);
    }

    if (input.length > 1000) {
      input = input.slice(0, 1000) + ' ...';
    }
    if (output.length > 1000) {
      output = output.slice(0, 1000) + ' ...';
    }

    return {
      fields: [ {
        name: 'Input',
        value: codeblock(input, 'javascript')
      }, {
        name: 'Output',
        value: codeblock(output, 'javascript')
          .replace(this.credentialRegex, 'i think the fuck not you trick ass bitch')
      } ],
    };
  }
}
