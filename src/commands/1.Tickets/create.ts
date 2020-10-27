import { ICommand, CommandParams, CommandOutput } from '../Command';
import { Ticket } from '../../Database/tables/Tickets';
import { TicketRenderer } from '../../renderers';
import { unique } from '../../lib/util';

export default class CreateCommand implements ICommand {
  name = 'create';
  help = '<content>';
  public async execute({ client, db, msg, args }: CommandParams): Promise<CommandOutput> {
    if (args.length === 0) {
      return 'you can\'t create an empty ticket, please try again.';
    }

    const ticket: Ticket = {
      userID: msg.author.id,
      _id: await db.tickets.getIncrementingID(),
      content: args.join(' '),
      recipients: [
        ...await db.recipients.getAllRecipientChannels(),
        await client.getDMChannel(msg.author.id).then(c => c.id)
      ]
        .filter(unique)
        .map(channelID => ({ channelID, messageID: null }))
    };

    await Promise.all(
      ticket.recipients.map((recipient, idx) =>
        client.createMessage(recipient.channelID, {
          embed: TicketRenderer.renderTicket(ticket, msg.author, TicketRenderer.States.OPEN)
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
      title: `Successfully created ticket #${ticket._id}`,
      fields: [ {
        name: 'Content',
        value: ticket.content
      } ],
      footer: { text: 'You should have received a copy of this ticket in your DMs.' }
    };
  }
}
