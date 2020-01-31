import Event from '../Event';
import { Message } from 'eris';
import * as handlers from './handlers';

export const onMessageCreate: Event = {
  packetName: 'messageCreate',
  async handler(msg: Message) {
    if (
      (msg.channel.type === 0 && msg.channel.guild.id !== this.opts.guildID)
    ) {
      return;
    }

    for (const handler of Object.values(handlers)) {
      await handler.call(this, msg);
    }
  }
};
