import Handler from './Handler';
import { commands } from '../../../../commands';
import { MessageContent } from 'eris';
import { config } from '../../../../';

const iOSDoubleHyphen = /—/g;
const whitelistedRoles = [
  config.roles.mods,
  config.roles.developers,
  config.roles.supportSpecialist
];
const whitelistedChannels = [
  config.channels.privateTesting,
  config.channels.modCommands,
  config.channels.devCategory,
  config.channels.supportSpecialist
];

export const handleCommand: Handler = async function (msg) {
  const guildMember = this
    .guilds.get(this.opts.guildIDs[0])
    .members.get(msg.author.id);

  if (
    msg.author.bot ||
    !guildMember ||
    whitelistedRoles.every(roleID => !msg.member.roles.includes(roleID)) ||
    (msg.channel.type === 0 && whitelistedChannels.every(channelID => msg.channel.id !== channelID && (msg.channel as any).parentID !== channelID)) ||
    !msg.content.toLowerCase().startsWith(this.opts.prefix)
  ) {
    return;
  }

  const [ commandName, ...args ] = msg.content
    .slice(this.opts.prefix.length)
    .replace(iOSDoubleHyphen, '--')
    .split(/ +/g);
  const command = commands.get(commandName);
  if (!command) {
    return;
  }

  try {
    const res = await command.execute({
      msg,
      args,
      ...this.context
    });

    if (res) {
      const opts: MessageContent = {};
      if (typeof res === 'string') {
        if (command.raw) {
          opts.content = res;
        } else {
          opts.embed = { description: res };
        }
      } else {
        opts.embed = res;
      }
    
      await msg.channel.createMessage(opts);
    }
  } catch (err) {
    console.error(err);
    msg.channel.createMessage({ embed: {
      color: 0xCA2D36,
      title: 'oh no',
      description: `\`\`\`js\n${err.stack}\n\`\`\``,
    }});
  }
};
