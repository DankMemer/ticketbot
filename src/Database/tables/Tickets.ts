import { GenericTable, GenericEntity } from './GenericTable';

export type Ticket = {
  userID: string;
  content: string;
  createdAt?: Date;
  recipients: Array<{ channelID: string; messageID: string }>;
} & GenericEntity;

export default class Tickets extends GenericTable<Ticket> {
  public async createTicket(ticket: Ticket): Promise<Ticket['_id']> {
    ticket.createdAt = new Date();
    await this.collection.insertOne(ticket);
    return ticket._id;
  }

  public async getTicket(_id: Ticket['_id']): Promise<Ticket> {
    return this.get(_id);
  }

  public async getTickets(): Promise<Ticket[]> {
    return this.getAll();
  }

  public async getTicketsByUser(userID: string): Promise<Ticket[]> {
    return this.find({ userID });
  }

  public async searchTickets(query: string): Promise<Ticket[]> {
    return this.find({ content: RegExp(query, 'i') });
  }

  public async updateTicket(_id: Ticket['_id'], newContent: Ticket['content']): Promise<void> {
    await this.collection.update(
      { _id },
      { $set: {
        content: newContent,
        createdAt: new Date()
      } }
    );
  }

  public async deleteTicket(_id: Ticket['_id']): Promise<void> {
    await this.collection.remove({ _id });
  }
}