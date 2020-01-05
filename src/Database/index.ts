import { MongoClient, Db } from 'mongodb';
import Tickets from './tables/Tickets';

export type DatabaseConfig = {
  url: string;
  dbName: string;
};

export default class Database {
  private config: DatabaseConfig;
  private dbConn: MongoClient;
  private db: Db;

  public tickets: Tickets;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  public async bootstrap(): Promise<void> {
    this.dbConn = await MongoClient.connect(this.config.url, {
      useUnifiedTopology: true
    });
    this.db = this.dbConn.db(this.config.dbName);
    this.tickets = new Tickets(this.db.collection('tickets'));
  }
}
