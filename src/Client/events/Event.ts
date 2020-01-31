import TicketBot from '../';

export default interface Event {
  packetName: string;
  once?: boolean;
  handler(this: TicketBot, ...any): Promise<void> | void;
}
