import { GenericTable, GenericEntity } from './GenericTable';

export type GrafanaAccount = {
  discordID: string;
  username: string;
  createdAt: Date;
} & GenericEntity;

export default class GrafanaAccounts extends GenericTable<GrafanaAccount> {
  public async createAccount(account: GrafanaAccount): Promise<void> {
    await this.collection.insertOne(account);
  }

  public async getAccountByUsername(username: GrafanaAccount['username']): Promise<GrafanaAccount | null> {
    return this.collection.findOne({ username });
  }

  public async getAccountByDiscordID(discordID: GrafanaAccount['discordID']): Promise<GrafanaAccount | null> {
    return this.collection.findOne({ discordID });
  }
}