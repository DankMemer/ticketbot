import Handler from './Handler';
import { TagAutoresponseRenderer } from '../../../../renderers';
const carlPrefixes = ['-', '.', '!'];
import { config } from '../../../../';

const TAG_DELETE_WHITELIST = [
  config.roles.mods,
  config.roles.formerMods,
  config.roles.trialMods
];

export const tagAutoresponse: Handler = async function (msg) {
  if (
    msg.author.bot ||
    !this.opts.channels.support.includes(msg.channel.id) ||
    !carlPrefixes.some(prefix => msg.content.startsWith(prefix)) ||
    TAG_DELETE_WHITELIST.some(roleID => msg.member.roles.includes(roleID)) ||
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
