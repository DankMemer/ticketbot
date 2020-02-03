import { ICommand, CommandParams, CommandOutput } from '../Command';
import { TicketRenderer } from '../../renderers';
import { Paginated } from '../decorators';

export default class ListCommand implements ICommand {
  name = 'list';
  help = '[user (id or mention)] [page (defaults to last)]';

  @Paginated({ resultsPerPage: 5, reversed: false })
  public async execute({ msg, args, db }: CommandParams): Promise<CommandOutput> {
    const target = msg.mentions[0]?.id || args[0] || msg.author.id;
    if (isNaN(+target)) {
      return `Invalid target \`${target}\`. Please supply a mention or ID.`;
    }

    const tickets = await db.tickets.getTicketsByUser(target);
    if (tickets.length === 0) {
      return `${target === msg.author.id ? 'You have' : `<@${target}> has`} no open tickets.`;
    }

    return TicketRenderer.renderTickets(tickets);
  }
}
