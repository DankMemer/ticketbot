import { Collection } from 'mongodb';

export default class GenericTable {
  public collection: Collection;
  protected currentID: number;

  constructor(collection: Collection) {
    this.collection = collection;
  }

  public async getIncrementingID(): Promise<number> {
    if (!this.currentID) {
      const currentIDResult = await this.collection.findOne({ currentID: { $exists: true } });
      if (currentIDResult) {
        this.currentID = currentIDResult.currentID;
      } else {
        this.collection.insertOne({ currentID: 0 });
        this.currentID = 0;
      }
    }

    this.collection.updateOne(
      { currentID: { $exists: true } },
      { $inc: { currentID: 1 } }
    );
    return ++this.currentID;
  }
}
