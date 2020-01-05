import { Client, Message } from 'eris';
import { commands, Context } from '../commands';
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
  development: boolean;
}

export default class TicketBot extends Client {
  public opts: TicketBotOptions;
  public context: Context;

  constructor (opts: TicketBotOptions) {
    super(opts.token, {
      getAllUsers: !opts.development
    });

    this.opts = opts;
    this.context = {
      commands,
      client: this,
      db: this.opts.db
    };

    this.on('ready', this.onReady);
    this.on('messageCreate', this.onMessage);
  }

  public connect (): Promise<void> {
    return Promise.all([
      super.connect(),
      this.opts.db.bootstrap()
    ]).then(() => {
      for (const command of commands.values()) {
        command.onLoad(this.context);
      }
    });
  }

  private onReady (): void {
    console.log('ready');
    this.editStatus('invisible');
  }

  private async onMessage (msg: Message): Promise<void> {
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

    const [ commandName, ...args ] = msg.content.slice(this.opts.prefix.length).split(/ +/g);
    const command = commands.get(commandName);
    if (!command) {
      return;
    }

    const res = await command.execute({
      msg,
      args,
      ...this.context
    });
    if (res) {
      msg.channel.createMessage({
        embed: typeof res === 'object' ? res : { description: res }
      });
    }
  }
}