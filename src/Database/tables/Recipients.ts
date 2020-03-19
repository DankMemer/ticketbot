import { GenericTable, GenericEntity } from './GenericTable';

export type Recipient = {
  userID: string;
  channelID: string;
} & GenericEntity;

export default class Recipients extends GenericTable<Recipient> {
  public async addRecipient(recipient: Recipient): Promise<void> {
    await this.collection.insertOne(recipient);
  }

  public async exists(recipient: Recipient): Promise<boolean> {
    return this.collection.findOne({ userID: recipient.userID }).then(Boolean);
  }

  public async removeRecipient(recipient: Recipient): Promise<void> {
    await this.collection.remove({ userID: recipient.userID });
  }

  public async getAllRecipientChannels(): Promise<Recipient['channelID'][]> {
    return this.getAll()
      .then(recipients => recipients.map(r => r.channelID));
  }
}