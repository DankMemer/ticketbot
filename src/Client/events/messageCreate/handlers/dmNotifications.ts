import Handler from './Handler';
import { GuildChannel } from 'eris';

export const dmNotifications: Handler = async function (msg) {
  for (const [ receiverID, opts ] of Object.entries(this.opts.dmNotifications)) {
    if (msg.mentions.find(mention => mention.id === receiverID) && opts.users.includes(msg.author.id)) {
      this.createMessage(
        opts.dmChannelID,
        `https://discordapp.com/channels/${
          msg.channel.type === 0
            ? (msg.channel as GuildChannel).guild.id
            : '@me'
        }/${msg.channel.id}/${msg.id}`
      );
    }
  }
};
