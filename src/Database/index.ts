import { MongoClient, Db } from 'mongodb';
import Tickets from './tables/Tickets';
import GrafanaAccounts from './tables/GrafanaAccounts';

export type DatabaseConfig = {
  url: string;
  dbName: string;
};

export default class Database {
  private config: DatabaseConfig;
  private dbConn: MongoClient;
  private db: Db;

  public tickets: Tickets;
  public grafanaAccounts: GrafanaAccounts;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  public async bootstrap(): Promise<void> {
    this.dbConn = await MongoClient.connect(this.config.url, {
      useUnifiedTopology: true
    });
    this.db = this.dbConn.db(this.config.dbName);
    this.tickets = new Tickets(this.db.collection('tickets'));
    this.grafanaAccounts = new GrafanaAccounts(this.db.collection('grafana_accounts'));
  }
}
