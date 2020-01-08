import { Command, Paginated, CommandParams, CommandOutput } from './Command';
import { dateToString } from '../util';
import { EmbedLimits } from '../Constants';

const TRUNCATE_MSG = '\n\n`...` [see full ticket with `gucci view`]';

export default class TodoCommand implements Command {
  name = 'todo';

  truncate (content: string): string {
    if (content.length < EmbedLimits.MAX_FIELD_VALUE) {
      return content;
    }

    return content.slice(0, EmbedLimits.MAX_FIELD_VALUE - TRUNCATE_MSG.length) + TRUNCATE_MSG;
  }

  @Paginated({ resultsPerPage: 5, reversed: true })
  public async execute({ db }: CommandParams): Promise<CommandOutput> {
    const tickets = await db.tickets.getTickets();
    return {
      title: 'Open Tickets',
      fields: tickets
        .sort((a, b) => a._id - b._id)
        .map(ticket => ({
          name: `Ticket #${ticket._id}`,
          value: this.truncate(`_Created/last edited at ${dateToString(ticket.createdAt)} by <@${ticket.userID}>_\n\n${ticket.content}`)
        }))
    };
  }
}
