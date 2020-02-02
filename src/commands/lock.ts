import { ICommand, CommandParams, CommandOutput } from './Command';
import { Restricted } from './decorators';
import { config } from '../';
import { TextChannel } from 'eris';
import { codeblock, capitalize } from '../lib/util';
import { Constants } from 'eris';

type ChannelState = Array<{ id: string; name: string; locked: boolean }>;
const SEND_MESSAGES_PERM_BITFIELD = Constants.Permissions.sendMessages;
const LOCKABLE_CHANNELS: string[] = [
  ...config.channels.support,
  ...config.channels.botCommands,
  config.channels.botFeedback,
  config.channels.generalChat,
  config.channels.premiumChat,
  config.channels.premiumCommands
];

@Restricted({ roleIDs: [ config.roles.directors, config.roles.modManagers ] })
export default class LockCommand implements ICommand {
  name = 'lockutil';
  help = '<list | lock | unlock> [all | ...#channels]';
  aliases = ['lu'];

  public async execute({ client, msg, args }: CommandParams): Promise<CommandOutput> {
    const mode = args.shift();
    switch (mode) {
      case 'list':
        return this.list(client);

      case 'lock':
      case 'unlock':
        return this.edit(mode, { client, msg, args });

      default:
        return codeblock(this.help);
    }
  }

  public async list(client: CommandParams['client']) {
    return {
      title: 'Lock State',
      description: codeblock(
        this.getState(client)
          .map(channel => `${channel.locked ? '- (LOCKED)  ' : '+ (UNLOCKED)'} #${channel.name}`)
          .join('\n'),
        'diff'
      ),
    }
  }

  private getState(client: CommandParams['client']): ChannelState {
    return LOCKABLE_CHANNELS.map(id => ({
      id,
      name: (client.getChannel(id) as TextChannel).name,
      locked: !(client.getChannel(id) as TextChannel)
        .permissionOverwrites
        .get(config.roles.acceptedRules)
        ?.has('sendMessages')
    }));
  }

  private async edit(
    mode: 'lock' | 'unlock',
    { client, msg, args }: Partial<CommandParams>
  ) {
    const channels = args[0] === 'all'
      ? LOCKABLE_CHANNELS
      : msg.channelMentions;

    if (channels.some(channel => !LOCKABLE_CHANNELS.includes(channel))) {
      return {
        title: 'The following channels aren\'t lockable:',
        description: channels
          .filter(channel => !LOCKABLE_CHANNELS.includes(channel))
          .map(channel => `- <#${channel}>`)
          .join('\n') + `\n\nPlease try running the command again.\nYou can see a list of lockable channels with \`${config.prefix}lockutil list\`.`
      }
    }

    const prompt = await msg.channel.createMessage({ embed: { description: `${capitalize(mode)}ing (${channels.length}) channels...` } });

    for (const channel of channels) {
      await (client.getChannel(channel) as TextChannel).editPermission(
        config.roles.acceptedRules,
        mode === 'lock' ? 0 : SEND_MESSAGES_PERM_BITFIELD,
        mode === 'lock' ? SEND_MESSAGES_PERM_BITFIELD : 0,
        'role',
        `${capitalize(mode)}ed by ${msg.author.username}`
      );
    }

    await prompt.edit({ embed: {
      description: `Operation successful.\nRun \`${config.prefix}lockutil list\` to confirm.`
    } });
    return null;
  }
}
