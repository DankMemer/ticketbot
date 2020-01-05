import GenericTable from './GenericTable';

export type Ticket = {
  _id?: number;
  userID: string;
  content: string;
  createdAt?: Date;
  recipients: Array<{ channelID: string; messageID: string }>;
};

export default class Tickets extends GenericTable {
  currentTicketID: number;

  public async createTicket (ticket: Ticket): Promise<Ticket['_id']> {
    ticket.createdAt = new Date();
    await this.collection.insertOne(ticket);
    return ticket._id;
  }

  public async getTicket (_id: Ticket['_id']): Promise<Ticket> {
    return this.collection.findOne({ _id });
  }

  public async getTickets (): Promise<Ticket[]> {
    return this.collection.find({ currentID: { $exists: false } }).toArray();
  }

  public async getTicketsByUser (userID: string): Promise<Ticket[]> {
    return this.collection.find({ userID }).toArray();
  }

  public async updateTicket (_id: Ticket['_id'], newContent: Ticket['content']): Promise<void> {
    await this.collection.update(
      { _id },
      { $set: {
        content: newContent,
        createdAt: new Date()
      } }
    );
  }

  public async deleteTicket (_id: Ticket['_id']): Promise<void> {
    await this.collection.remove({ _id });
  }
}