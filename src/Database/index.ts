import { MongoClient, Db } from 'mongodb';
import Tickets from './tables/Tickets';
import GrafanaAccounts from './tables/GrafanaAccounts';
import { config } from '../';

export default class Database {
  private db: Db;
  
  public tickets: Tickets;
  public grafanaAccounts: GrafanaAccounts;

  public async bootstrap(): Promise<void> {
    const dbConn = await MongoClient.connect(config.keys.mongo, {
      useUnifiedTopology: true
    });
    this.db = dbConn.db();
    this.tickets = new Tickets(this.db.collection('tickets'));
    this.grafanaAccounts = new GrafanaAccounts(this.db.collection('grafana_accounts'));
  }
}
