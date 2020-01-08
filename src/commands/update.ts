import { Command, CommandParams, CommandOutput } from './Command';
import { Emojis } from '../Constants';
import { TicketRenderer } from '../renderers';

export default class UpdateCommand implements Command {
  name = 'update';
  aliases = ['edit'];
  help = '<ticket id> <new content> [--override]';
  public async execute({ client, msg, args, db }: CommandParams): Promise<CommandOutput> {
    if (!args[0]) {
      return `specify a ticket ID and try again ${Emojis.GUCCI_REE}`;
    }
    if (!args[1]) {
      return `specify the new content of this ticket and try again ${Emojis.GUCCI_REE}`;
    }

    const override = args.includes('--override') && args.splice(args.indexOf('--override'), 1);
    const newContent = args.slice(1).join(' ');
    const ticket = await db.tickets.getTicket(+args[0]);
    if (!ticket) {
      return `no ticket with ID #${args[0]} ${Emojis.GUCCI_PANIC_2}`;
    }
    if (ticket.userID !== msg.author.id && !override) {
      return `you don't own this ticket ${Emojis.GUCCI_PANIC_2}\n(run again with \`--override\` to edit the ticket if this was not a mistake)`;
    }

    ticket.content = newContent;
    for (const recipient of ticket.recipients) {
      client.editMessage(recipient.channelID, recipient.messageID, {
        embed: TicketRenderer.renderTicket(ticket, client.users.get(ticket.userID), TicketRenderer.States.OPEN)
      }).catch(() => void 0);
    }

    await db.tickets.updateTicket(ticket._id, newContent);

    return {
      title: `Updated ticket #${ticket._id} ${Emojis.GUCCI_THINK}`,
      fields: [ {
        name: 'New content',
        value: newContent
      } ]
    };
  }
}
