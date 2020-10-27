import { Counter } from 'prom-client';
import Handler from './Handler';
import { config } from '../../../../';

const messages = new Counter({
  name: 'messages',
  help: 'm help',
  labelNames: ['author_id', 'channel_id'],
});

const ROLE_WHITELIST = [
  config.roles.mods,
  config.roles.supportSpecialist
];

export const metrics: Handler = async function (msg) {
  if (
    !msg.author.bot &&
    msg.member &&
    ROLE_WHITELIST.some(role => msg.member.roles.includes(role))
  ) {
    messages.inc({
      'author_id': msg.author.id,
      'channel_id': msg.channel.id,
    });
  }
};
