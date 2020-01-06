import { Message } from 'eris';
import TicketBot from '../../../';

type Handler = (this: TicketBot, msg: Message) => Promise<void> | void;
export default Handler;
