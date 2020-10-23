import { connect, connection, Connection } from 'mongoose';
import { IOrderModel, Order } from '../models/order';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ITradeModel, Trade } from '../models/trade';

declare interface IModels {
  Order: IOrderModel;
  Trade: ITradeModel;
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
      Order: new Order().model,
      Trade: new Trade().model
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
