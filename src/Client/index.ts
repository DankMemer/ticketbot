import { Client, Message } from 'eris';
import commands from '../commands';
import Database from '../Database';

export type TicketBotOptions = {
  token: string;
  guildID: string;
  channelID: string;
  roleID: string;
  prefix: string;
  db: Database;
  recipients: string[];
  owners: string[];
}

export default class TicketBot extends Client {
  public opts: TicketBotOptions;

  constructor (opts: TicketBotOptions) {
    super(opts.token, {
      getAllUsers: true
    });

    this.opts = opts;

    this.on('ready', this.onReady);
    this.on('messageCreate', this.onMessage);
  }

  connect () {
    return Promise.all([
      super.connect(),
      this.opts.db.bootstrap()
    ]).then(() => void 0);
  }

  private onReady () {
    console.log('ready');
    this.editStatus('invisible');
  }

  private async onMessage (msg: Message) {
    const guildMember = this
      .guilds.get(this.opts.guildID)
      .members.get(msg.author.id);

    if (
      msg.author.bot ||
      !guildMember ||
      !guildMember.roles.includes(this.opts.roleID) ||
      (msg.channel.type === 0 && msg.channel.id !== this.opts.channelID) ||
      !msg.content.startsWith(this.opts.prefix)
    ) {
      return;
    }

    const [ commandName, ...args ] = msg.content.slice(this.opts.prefix.length).split(/ /g);
    const command = commands.get(commandName);
    if (!command) {
      return;
    }

    const res = await command.execute({
      msg,
      args,
      commands,
      client: this,
      db: this.opts.db
    });
    if (res) {
      msg.channel.createMessage({
        embed: typeof res === 'object' ? res : { description: res }
      });
    }
  }
}