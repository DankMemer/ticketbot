import { Command, Paginated, CommandParams, CommandOutput } from './Command';
import { TicketRenderer } from '../renderers';

export default class ListCommand implements Command {
  name = 'list';
  help = '[page (defaults to last)]'

  @Paginated({ resultsPerPage: 5, reversed: false })
  public async execute({ msg, db }: CommandParams): Promise<CommandOutput> {
    const tickets = await db.tickets.getTicketsByUser(msg.author.id);
    if (tickets.length === 0) {
      return 'You have no open tickets.';
    }

    return TicketRenderer.renderTickets(tickets);
  }
}
