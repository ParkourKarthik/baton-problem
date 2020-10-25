import { Request, Response } from 'express';
import DB from './db';

export class TradeController {
  public GetAll(req: Request, res: Response) {
    const query = req.query;
    const match = {};
    for (const key in query) {
      if (key != 'date') {
        match['buyOrder.' + key] = query[key];
        match['sellOrder.' + key] = query[key];
      } else {
        match[key] = new Date(query[key] as string);
      }
    }
    DB.Models.Trade.aggregate(
      [
        {
          $lookup: {
            from: 'orders',
            localField: 'buy_id',
            foreignField: '_id',
            as: 'buyOrder'
          }
        },
        {
          $lookup: {
            from: 'orders',
            localField: 'sell_id',
            foreignField: '_id',
            as: 'sellOrder'
          }
        },
        {
          $unwind: '$sellOrder'
        },
        {
          $unwind: '$buyOrder'
        },
        {
          $match: Object.values(match).length
            ? {
                $or: Object.entries(match).map(([x, y]) => ({ [x]: y }))
              }
            : {}
        },
        {
          $project: {
            buyer: "$buyOrder.party",
            seller: "$sellOrder.party",
            stock: "$buyOrder.stock",
            price: "$buyOrder.price",
            date: "$date"
          }
        }
      ],
      (er, agg) => {
        if (er) res.json(er);
        if (agg) res.json(agg);
      }
    );
  }
}
