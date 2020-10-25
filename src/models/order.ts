import { Document, model, Model, Schema } from 'mongoose';
import DB from '../controllers/db';
import { ITrade } from './trade';

export declare interface IOrder extends Document {
  _id: Schema.Types.ObjectId;
  party: string;
  stock: string;
  type: Type;
  price: number;
  matched: boolean;
}

export enum Type {
  BUY = 'BUY',
  SELL = 'SELL'
}

export type IOrderModel = Model<IOrder>;

export class Order {
  private _model: Model<IOrder>;

  constructor() {
    const orderSchema = new Schema({
      party: { type: String, required: true },
      stock: { type: String, required: true },
      type: { type: String, required: true },
      price: { type: Number, required: true },
      matched: { type: Boolean, default: false }
    });

    orderSchema.pre<IOrder>('save', function (next) {
      const orderQuery = (({ type, price, stock }) => ({
        type: type === Type.BUY ? Type.SELL : Type.BUY,
        price,
        stock,
        matched: false
      }))(this);
      DB.Models.Order.findOne(orderQuery, {}, (err: any, ord: any) => {
        if (ord) {
          this.matched = true;
          const query = (({ type, price, stock }) => ({ type, price, stock }))(
            ord
          );
          DB.Models.Order.updateOne(query, { $set: { matched: true } });
        }
        if (this && this.matched) {
          const newTrade: ITrade = new DB.Models.Trade({
            sell_id: ord.type == 'SELL' ? ord._id : this._id,
            buy_id: ord.type == 'BUY' ? ord._id : this._id,
            date: new Date().toLocaleDateString()
          });
          newTrade.save();
        }
      });
      next();
    });

    this._model = model<IOrder>('Order', orderSchema);
  }

  public get model(): Model<IOrder> {
    return this._model;
  }
}
