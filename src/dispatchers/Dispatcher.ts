import { Message } from 'eris';
import TicketBot from '../Client';

type Dispatcher<T> = (this: TicketBot, arg0: T) => Promise<Message>;
export default Dispatcher;
