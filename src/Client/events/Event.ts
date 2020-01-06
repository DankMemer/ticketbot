import TicketBot from '../';

export default interface Event {
  packetName: string;
  handler(this: TicketBot, ...any): Promise<void> | void;
}
