import { Document, model, Model, Schema } from 'mongoose';

export declare interface IOrder extends Document {
  _id: Schema.Types.ObjectId;
  party: string;
  stock: string;
  type: Type;
  price: number;
}

export enum Type {
  BUY = 'BUY',
  SELL = 'SELL'
}

export declare interface IOrderModel extends Model<IOrder>{
}

export class Order {
  // tslint:disable-next-line: variable-name
  private _model: Model<IOrder>;

  constructor() {
    const orderSchema = new Schema({
      party: { type: String, required: true },
      stock: { type: String, required: true },
      type: { type: String, required: true },
      price: { type: Number, required: true }
    });

    this._model = model<IOrder>('Order', orderSchema);
  }

  public get model(): Model<IOrder> {
    return this._model;
  }
}
