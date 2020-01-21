import { ICommand, Paginated, CommandParams, CommandOutput } from './Command';
import { TicketRenderer } from '../renderers';

export default class TodoCommand implements ICommand {
  name = 'todo';
  help = '[page (defaults to last)]'

  @Paginated({ resultsPerPage: 5, reversed: true })
  public async execute({ db }: CommandParams): Promise<CommandOutput> {
    const tickets = await db.tickets.getTickets();
    return TicketRenderer.renderTickets(tickets);
  }
}
