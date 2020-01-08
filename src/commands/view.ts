import { Command, CommandParams, CommandOutput } from './Command';
import { TicketRenderer } from '../renderers';

export default class ViewCommand implements Command {
  name = 'view';

  public async execute({ client, db, args }: CommandParams): Promise<CommandOutput> {
    const ticket = await db.tickets.getTicket(+args[0]);
    if (!ticket) {
      return `I couldn't find a ticket with ID ${args[0]}`;
    }

    return TicketRenderer.render(ticket, client.users.get(ticket.userID), TicketRenderer.States.OPEN);
  }
}