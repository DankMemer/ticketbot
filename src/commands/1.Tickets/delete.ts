import { ICommand, CommandParams, CommandOutput } from '../Command';
import { TicketRenderer } from '../../renderers';

export default class DeleteCommand implements ICommand {
  name = 'delete';
  aliases = ['remove', 'del', 'close'];
  help = '<ticket id> [--override]';
  public async execute({ client, msg, args, db }: CommandParams): Promise<CommandOutput> {
    if (!args[0]) {
      return 'specify a ticket ID and try again';
    }

    const override = args.includes('--override') && args.splice(args.indexOf('--override'), 1);
    const ticket = await db.tickets.getTicket(+args[0]);
    if (!ticket) {
      return `no ticket with ID #${args[0]}`;
    }
    if (
      (ticket.userID !== msg.author.id && !override) &&
      !client.opts.owners.includes(msg.author.id)
    ) {
      return 'you don\'t own this ticket.\n(run again with `--override` to delete the ticket if this was not a mistake)';
    }

    for (const recipient of ticket.recipients) {
      client.editMessage(recipient.channelID, recipient.messageID, {
        embed: TicketRenderer.renderTicket(ticket, client.users.get(ticket.userID), TicketRenderer.States.CLOSED, msg.author)
      }).catch(() => void 0);
    }

    await db.tickets.deleteTicket(ticket._id);

    return {
      title: `Deleted ticket #${ticket._id}`
    };
  }
}

