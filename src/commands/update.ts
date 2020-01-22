import { ICommand, CommandParams, CommandOutput } from './Command';
import { Emojis } from '../Constants';
import { TicketRenderer } from '../renderers';
import { dateToString } from '../lib/util';

export default class UpdateCommand implements ICommand {
  name = 'update';
  aliases = ['edit'];
  help = '<ticket id> <new content> [--append] [--override]';
  public async execute({ client, msg, args, db }: CommandParams): Promise<CommandOutput> {
    if (!args[0]) {
      return `specify a ticket ID and try again ${Emojis.GUCCI_REE}`;
    }
    if (!args[1]) {
      return `specify the new content of this ticket and try again ${Emojis.GUCCI_REE}`;
    }

    const override = args.includes('--override') && args.splice(args.indexOf('--override'), 1);
    const append = args.includes('--append') && args.splice(args.indexOf('--append'), 1);
    const newContent = args.slice(1).join(' ');
    const ticket = await db.tickets.getTicket(+args[0]);
    if (!ticket) {
      return `no ticket with ID #${args[0]} ${Emojis.GUCCI_PANIC_2}`;
    }
    if (ticket.userID !== msg.author.id && !override) {
      return `you don't own this ticket ${Emojis.GUCCI_PANIC_2}\n(run again with \`--override\` to edit the ticket if this was not a mistake)`;
    }

    if (append) {
      ticket.content = ticket.content.trim() + `\n\n*--- Appended at ${dateToString(new Date())} ---*\n${newContent}`
    } else {
      ticket.content = newContent;
    }
    for (const recipient of ticket.recipients) {
      client.editMessage(recipient.channelID, recipient.messageID, {
        embed: TicketRenderer.renderTicket(ticket, client.users.get(ticket.userID), TicketRenderer.States.OPEN)
      }).catch(() => void 0);
    }

    await db.tickets.updateTicket(ticket._id, ticket.content);

    return {
      title: `Updated ticket #${ticket._id} ${Emojis.GUCCI_THINK}`,
      fields: [ {
        name: 'New content',
        value: ticket.content
      } ]
    };
  }
}
