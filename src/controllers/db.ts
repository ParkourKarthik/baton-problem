import { connect, connection, Connection, Types } from 'mongoose';
import { IOrderModel, Order } from '../models/order';
import { MongoMemoryServer } from 'mongodb-memory-server';

declare interface IModels {
  Order: IOrderModel;
}

export default class DB {
  private static instance: DB;
  private mongod: MongoMemoryServer = new MongoMemoryServer();
  private uri: Promise<string> = this.mongod.getUri();
  private mongoUrl: string;

  private _db: Connection;
  private _models: IModels;

  private constructor() {
    this.uri.then(
      url => {
        connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false
        })
          .then(val => {
            if (val) this.connected();
          })
          .catch(err => this.error(err));
      },
      err => this.error(err)
    );
    this._db = connection;
    this._models = {
      //@ts-ignore
      Order: new Order().model,
    };
  }

  public static get Models() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance._models;
  }

  private connected() {
    console.log('Mongoose has connected');
  }

  private error(error) {
    console.log('Mongoose has error', error);
  }
}
