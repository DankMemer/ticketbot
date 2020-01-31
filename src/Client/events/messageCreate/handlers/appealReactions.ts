import Handler from './Handler';
import { Emojis } from '../../../../Constants';

export const appealReactions: Handler = async function (msg) {
  if (msg.author.id === this.opts.appealHookID) {
    await msg.addReaction(Emojis.TICK_NO);
    await msg.addReaction(Emojis.TICK_MAYBE);
    await msg.addReaction(Emojis.TICK_YES);
  }
};
