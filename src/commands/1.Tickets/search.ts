import { ICommand, CommandParams, CommandOutput } from '../Command';
import { TicketRenderer } from '../../renderers';
import { Paginated } from '../decorators';

export default class SearchCommand implements ICommand {
  name = 'search';
  aliases = ['find'];
  help = '<query> [page (defaults to last page)]';

  @Paginated({ resultsPerPage: 5, reversed: true })
  public async execute({ db, args }: CommandParams): Promise<CommandOutput> {
    const query = args.join(' ').trim();
    if (!query) {
      return 'Provide a search query and try again.';
    }

    const tickets = await db.tickets.searchTickets(query);
    return tickets.length === 0
      ? `No tickets found for query \`${query}\`.`
      : TicketRenderer.renderTickets(tickets);
  }
}
