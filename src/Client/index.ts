import { Client } from 'eris';
import { commands, Context } from '../commands';
import * as events from './events';
import Database from '../Database';

export type TicketBotOptions = {
  keys: {
    discord: string;
    youtube: string;
    lavalink: string;
    grafana: string;
    mongo: string;
    redis: string;
    rethink: string;
    dbServerHost: string;
  };
  guildID: string;
  appealHookID: string;
  channels: {
    support: string[];
    modCommands: string;
    devCategory: string;
    botFeedback: string;
    generalChat: string;
    premiumChat: string;
    botCommands: string[];
    premiumCommands: string;
    betaCommands: string;
    statusUpdates: string;
  };
  roles: {
    mods: string;
    formerMods: string;
    trialMods: string;
    acceptedRules: string;
    modManagers: string;
    directors: string;
    spentSomeMoney: string;
  };
  dmNotifications: {
    [id: string]: {
      users: string[];
      dmChannelID: string;
    };
  };
  metrics: {
    prometheusPort: number;
    grafanaURL: string;
  };
  prefix: string;
  recipients: string[];
  owners: string[];
  development: boolean;
  music: boolean;
};

export default class TicketBot extends Client {
  public opts: TicketBotOptions;
  public context: Context;

  constructor(opts: TicketBotOptions) {
    super(opts.keys.discord, {
      getAllUsers: !opts.development
    });

    this.opts = opts;
    this.context = {
      commands,
      client: this,
      db: new Database(),
    };

    this.loadEvents();
  }

  public async bootstrap(): Promise<void> {
    await Promise.all([
      super.connect(),
      this.context.db.bootstrap()
        .then(() => this.loadCommands())
    ]);
  }

  public async loadCommands(): Promise<number> {
    return Promise.all(
      [ ...commands.values() ]
        .map(command => command.onLoad!(this.context))
    ).then(r => r.length);
  }

  public loadEvents(): void {
    for (const event of Object.values(events)) {
      // @ts-ignore
      this[event.once ? 'once' : 'on'](event.packetName, event.handler.bind(this));
    }
  }
}