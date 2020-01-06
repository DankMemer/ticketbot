import { Client } from 'eris';
import { commands, Context } from '../commands';
import * as events from './events';
import Database from '../Database';

export type TicketBotOptions = {
  token: string;
  guildID: string;
  channels: {
    support: string[];
    modCommands: string;
  };
  roles: {
    mods: string;
    formerMods: string;
  };
  prefix: string;
  db: Database;
  recipients: string[];
  owners: string[];
  development: boolean;
};

export default class TicketBot extends Client {
  public opts: TicketBotOptions;
  public context: Context;

  constructor(opts: TicketBotOptions) {
    super(opts.token, {
      getAllUsers: !opts.development
    });

    this.opts = opts;
    this.context = {
      commands,
      client: this,
      db: this.opts.db
    };

    this.loadEvents();
  }

  public connect(): Promise<void> {
    return Promise.all([
      super.connect(),
      this.opts.db.bootstrap()
    ]).then(() => {
      for (const command of commands.values()) {
        command.onLoad(this.context);
      }
    });
  }

  public loadEvents(): void {
    for (const event of Object.values(events)) {
      this.on(event.packetName, event.handler.bind(this));
    }
  }
}