import { Command, Paginated, CommandParams, CommandOutput } from './Command';
import { dateToString } from '../util';

export default class TodoCommand implements Command {
  name = 'todo';

  @Paginated({ resultsPerPage: 5, reversed: true })
  public async execute ({ db }: CommandParams): Promise<CommandOutput> {
    const tickets = await db.tickets.getTickets();
    return {
      title: 'Open Tickets',
      fields: tickets
        .sort((a, b) => a._id - b._id)
        .map(ticket => ({
          name: `Ticket #${ticket._id}`,
          value: `_Created/last edited at ${dateToString(ticket.createdAt)} by <@${ticket.userID}>_\n\n${ticket.content}`
        }))
    };
  }
}
