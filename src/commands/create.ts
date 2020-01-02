import { Command } from './Command';
import { Ticket } from '../Database/tables/Tickets';
import { Emojis } from '../Constants';
import { TicketRenderer } from '../renderers';

export const createCommand: Command = {
  name: 'create',
  help: '<content>',
  execute: async ({ client, db, msg, args }) => {
    if (args.length === 0) {
      return `Meow, you cannot send an empty ticket, please try again. ${Emojis.GUCCI_REE}`;
    }

    const ticket: Ticket = {
      userID: msg.author.id,
      _id: await db.tickets.getIncrementingID(),
      content: args.join(' '),
      recipients: [
        ...client.opts.recipients,
        await client.getDMChannel(msg.author.id).then(c => c.id)
      ]
        .filter((channelID, index, self) => self.indexOf(channelID) === index)
        .map(channelID => ({ channelID, messageID: null }))
    };

    await Promise.all(
      ticket.recipients.map((recipient, idx) =>
        client.createMessage(recipient.channelID, {
          embed: TicketRenderer.render(ticket, msg.author, TicketRenderer.States.OPEN)
        })
          .then(message => {
            recipient.messageID = message.id;
          })
          .catch(() => {
            ticket.recipients.splice(idx, 1);
          })
      )
    );

    await db.tickets.createTicket(ticket);

    return {
      title: `Successfully created ticket #${ticket._id} ${Emojis.GUCCI_SIDEEYE}`,
      fields: [ {
        name: 'Content',
        value: ticket.content
      } ],
      footer: { text: 'You should have received a copy of this ticket in your DMs.' }
    };
  }
};
