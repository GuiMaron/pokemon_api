import * as dotevnv from 'dotenv';
import { MongoClient, Db, Collection, WithId, Document, InsertOneResult, UpdateResult } from 'mongodb';

import {
  CONNECTION_ERROR_MESSAGE,
  FETCH_DATA_ERROR_MESSAGE,
  INSERT_DATA_ERROR_MESSAGE,
  UPDATE_DATA_ERROR_MESSAGE,
} from '../../constants';
import { idToNum } from '../../helpers/idToNum';
import { AppError } from '../../types/AppError';

dotevnv.config();

// Replace the uri string with your connection string.
export class MongoDBClient {
  uri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_CLUSTER_URL}/`;
  dbClient = new MongoClient(this.uri);

  initialized: boolean = false;
  db: Db;
  collection: Collection;

  async init(): Promise<boolean> {
    try {
      const initialization = await this.dbClient.connect();
    } catch (error) {
      this.initialized = false;
      return false;
    }

    this.initialized = true;
    this.db = this.dbClient.db(`${process.env.MONGO_DB_DATABASE}`);
    this.collection = this.db.collection(`${process.env.MONGO_DB_COLLECTION}`);

    // Creating a search index
    await this.collection.createIndexes([{ name: 'pokemon_name', key: { name: 'text' } }]);

    return this.initialized;
  }

  async query(parameters?: any, sort?: string): Promise<any> {
    if (!this.initialized) {
      this.initialized = await this.init();
    }
    if (!this.initialized) {
      return new AppError(true, CONNECTION_ERROR_MESSAGE);
    }

    let result: WithId<Document>[];
    try {
      result = await this.collection
        .find(parameters)
        .sort({ [`${sort ?? 'id'}`]: 1, _id: 1 })
        .toArray();
    } catch (error) {
      return new AppError(true, FETCH_DATA_ERROR_MESSAGE);
    }

    return result;
  }

  async queryOne(parameters?: any): Promise<any> {
    if (!this.initialized) {
      this.initialized = await this.init();
    }
    if (!this.initialized) {
      return new AppError(true, CONNECTION_ERROR_MESSAGE);
    }

    let result: WithId<Document>;
    try {
      result = await this.collection.findOne(parameters);
    } catch (error) {
      return new AppError(true, FETCH_DATA_ERROR_MESSAGE);
    }

    return result;
  }

  async insertOne(data?: any): Promise<any> {
    if (!this.initialized) {
      this.initialized = await this.init();
    }
    if (!this.initialized) {
      return new AppError(true, CONNECTION_ERROR_MESSAGE);
    }

    let result: InsertOneResult<Document>;
    try {
      result = await this.collection.insertOne(data);
    } catch (error) {
      return new AppError(true, INSERT_DATA_ERROR_MESSAGE);
    }

    return result;
  }

  async updateMany(find: any, update: any): Promise<any> {
    if (!this.initialized) {
      this.initialized = await this.init();
    }
    if (!this.initialized) {
      return new AppError(true, CONNECTION_ERROR_MESSAGE);
    }

    let result: UpdateResult<Document>;
    try {
      result = await this.collection.updateMany(find, update);
    } catch (error) {
      return new AppError(true, UPDATE_DATA_ERROR_MESSAGE);
    }

    return result;
  }

  async getById(id: number): Promise<any> {
    return this.query({
      $or: [
        { next_evolution: { $elemMatch: { num: idToNum(id) } } }, //  Past evolutions
        { id: { $eq: id } }, // The pokemon itself
        { prev_evolution: { $elemMatch: { num: idToNum(id) } } }, //  Future evolutions
      ],
    });
  }

  async getByType(type: string, sort: string): Promise<any> {
    return this.query(
      {
        type: { $eq: type },
      },
      sort,
    );
  }

  async getByName(name: string): Promise<any> {
    return this.queryOne({
      name: { $regex: `${name}`, $options: 'mui' },
    });
  }
}

let instance: MongoDBClient;

export function getMongoDbInstance() {
  if (!instance) {
    instance = new MongoDBClient();
  }
  return instance;
}
