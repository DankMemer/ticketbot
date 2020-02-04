import { Counter } from 'prom-client';
import Handler from './Handler';

const messages = new Counter({
  name: 'messages',
  help: 'm help',
  labelNames: ['author_id', 'channel_id'],
});

export const metrics: Handler = async function (msg) {
  if (
    !msg.author.bot &&
    msg.member &&
    msg.member.roles.includes(this.opts.roles.mods)
  ) {
    messages.inc({
      author_id: msg.author.id,
      channel_id: msg.channel.id,
    });
  }
};
