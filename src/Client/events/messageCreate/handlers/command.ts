import Handler from './Handler';
import { commands } from '../../../../commands';
import { MessageContent } from 'eris';

const iOSDoubleHyphen = /—/g;

export const handleCommand: Handler = async function (msg) {
  const guildMember = this
    .guilds.get(this.opts.guildID)
    .members.get(msg.author.id);

  if (
    !guildMember ||
    !guildMember.roles.includes(this.opts.roles.mods) ||
    (msg.channel.type === 0 && (msg.channel.id !== this.opts.channels.modCommands && msg.channel.parentID !== this.opts.channels.devCategory)) ||
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

  const res = await command.execute({
    msg,
    args,
    ...this.context
  });

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

  msg.channel.createMessage(opts);
};
