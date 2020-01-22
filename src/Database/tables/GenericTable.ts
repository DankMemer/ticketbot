import { Collection } from 'mongodb';

export type GenericEntity = {
  _id?: number;
};

export class GenericTable<Entity extends GenericEntity> {
  public collection: Collection;
  protected currentID: number;

  constructor(collection: Collection) {
    this.collection = collection;
  }

  protected get(_id: Entity['_id']): Promise<Entity> {
    return this.collection.findOne({ _id });
  }

  protected getAll(): Promise<Entity[]> {
    return this.find({});
  }

  protected find(query: object = {}): Promise<Entity[]> {
    return this.collection.find({
      currentID: { $exists: false },
      ...query
    }).toArray();
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
