import Event from '../Event';
import { Message } from 'eris';
import * as handlers from './handlers';

export const onMessageCreate: Event = {
  packetName: 'messageCreate',
  async handler(msg: Message) {
    if (
      (msg.channel.type === 0 && !this.opts.guildIDs.includes(msg.channel.guild.id))
    ) {
      return;
    }

    for (const handler of Object.values(handlers)) {
      await handler.call(this, msg);
    }
  }
};
