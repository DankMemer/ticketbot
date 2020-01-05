import { Command, Paginated, CommandParams, CommandOutput } from './Command';
import { dateToString } from '../util';

export default class ListCommand implements Command {
  name = 'list';

  @Paginated({ resultsPerPage: 10, reversed: false })
  public async execute({ msg, db }: CommandParams): Promise<CommandOutput> {
    const tickets = await db.tickets.getTicketsByUser(msg.author.id);
    if (tickets.length === 0) {
      return 'You have no open tickets.';
    }

    return {
      title: 'Open Tickets',
      fields: tickets
        .sort((a, b) => a._id - b._id)
        .map(ticket => ({
          name: `Ticket #${ticket._id}`,
          value: `_Created/last edited at ${dateToString(ticket.createdAt)}_\n\n${ticket.content}`
        }))
    };
  }
}
