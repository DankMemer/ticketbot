import Handler from './Handler';
import { commands } from '../../../../commands';

export const handleCommand: Handler = async function (msg) {
  const guildMember = this
    .guilds.get(this.opts.guildID)
    .members.get(msg.author.id);

  if (
    !guildMember ||
    !guildMember.roles.includes(this.opts.roles.mods) ||
    (msg.channel.type === 0 && msg.channel.id !== this.opts.channels.modCommands) ||
    !msg.content.startsWith(this.opts.prefix)
  ) {
    return;
  }

  const [ commandName, ...args ] = msg.content.slice(this.opts.prefix.length).split(/ +/g);
  const command = commands.get(commandName);
  if (!command) {
    return;
  }

  const res = await command.execute({
    msg,
    args,
    ...this.context
  });
  if (res) {
    msg.channel.createMessage({
      embed: typeof res === 'object' ? res : { description: res }
    });
  }
};
