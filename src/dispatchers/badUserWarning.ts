import Dispatcher from './Dispatcher';
import { User, Member } from 'eris';
import { highlight } from '../util';

export const badUserWarning: Dispatcher<{
  user: User | Member;
  badWord: string;
  propertyName: string;
  propertyValue: string;
}> = function ({ user, propertyName, propertyValue, badWord }) {
  return this.createMessage(this.opts.channels.modCommands, { embed: {
    title: '⚠️ Bad User',
    description: `Detected a bad word in \`${user.username}#${user.discriminator}\`'s ${propertyName}.`,
    fields: [ {
      name: propertyName,
      value: highlight(propertyValue, badWord)
    } ]
  } });
};
