import Handler from './Handler';
import { TagAutoresponseRenderer } from '../../../../renderers';
const carlPrefixes = ['-', '.', '!'];

export const tagAutoresponse: Handler = async function (msg) {
  if (
    !this.opts.channels.support.includes(msg.channel.id) ||
    !carlPrefixes.some(prefix => msg.content.startsWith(prefix)) ||
    msg.member.roles.includes(this.opts.roles.mods) ||
    msg.member.roles.includes(this.opts.roles.formerMods) ||
    msg.content.length === 1
  ) {
    return;
  }

  msg.delete().catch(() => void 0);
  const embed = { embed: TagAutoresponseRenderer.render(msg.author) };

  try {
    const dmChannel = await this.getDMChannel(msg.author.id);
    await dmChannel.createMessage(embed);
  } catch (_) {
    const response = await msg.channel.createMessage(embed);
    setTimeout(() => {
      response.delete();
    }, 3000);
  }
};
