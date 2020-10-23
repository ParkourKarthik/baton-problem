import { Document, model, Model, Schema } from 'mongoose';

export declare interface ITrade extends Document {
  _id: Schema.Types.ObjectId;
  sell_id: Schema.Types.ObjectId;
  buy_id: Schema.Types.ObjectId;
  date: Schema.Types.Date;
  price: number;
}

export type ITradeModel = Model<ITrade>

export class Trade {
  private _model: Model<ITrade>;

  constructor() {
    const tradeSchema = new Schema({
      sell_id: { type: Schema.Types.ObjectId, required: true },
      buy_id: { type: Schema.Types.ObjectId, required: true },
      date: { type: Date, required: true }
    });

    this._model = model<ITrade>('Trade', tradeSchema);
  }

  public get model(): Model<ITrade> {
    return this._model;
  }
}
