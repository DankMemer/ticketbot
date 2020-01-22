import { Ticket } from '../Database/tables/Tickets';
import { User, EmbedOptions } from 'eris';
import { dateToString } from '../lib/util';
import { EmbedLimits } from '../Constants';

const TRUNCATE_MSG = '\n\n`...` [see full ticket with `gucci view`]';
enum TicketRenderStates {
  OPEN,
  CLOSED,
}

export const TicketRenderer = {
  truncate(content: string): string {
    if (content.length < EmbedLimits.MAX_FIELD_VALUE) {
      return content;
    }

    return content.slice(0, EmbedLimits.MAX_FIELD_VALUE - TRUNCATE_MSG.length) + TRUNCATE_MSG;
  },

  renderTicket: (ticket: Ticket, user: User, state: TicketRenderStates, closer?: User): EmbedOptions => ({
    title: `Ticket: #${ticket._id}`,
    color: state === TicketRenderStates.OPEN
      ? 0xd48f1c
      : 0xca2d36,
    fields: [ {
      name: 'Ticket creator',
      value: user.username
    }, {
      name: 'Ticket content',
      value: ticket.content
    }, {
      name: 'State',
      value: state === TicketRenderStates.OPEN
        ? 'Open'
        : `Closed by ${closer.username} at ${dateToString(new Date())}`
    } ]
  }),

  renderTickets: (tickets: Ticket[]): EmbedOptions => ({
    title: 'Open Tickets',
    fields: tickets
      .sort((a, b) => a._id - b._id)
      .map(ticket => ({
        name: `Ticket #${ticket._id}`,
        value: TicketRenderer.truncate(`_Created/last edited at ${dateToString(ticket.createdAt)} by <@${ticket.userID}>_\n\n${ticket.content}`)
      }))
  }),

  States: TicketRenderStates
};
