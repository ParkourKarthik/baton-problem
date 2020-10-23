import { Request, Response } from 'express';
import DB from './db';
import { IOrder, Type } from '../models/order';
import { ITrade } from '../models/trade';

export class OrderController {
  public Add(req: Request, res: Response) {
    console.log('add', req.body);
    const order = req.body;
    const orderQuery = (({ type, price, stock }) => ({
      type: type === Type.BUY ? Type.SELL : Type.BUY,
      price,
      stock,
      matched: false
    }))(order);
    try {
      const callback = (err: any, ord: any) => {
        if (err) {
          throw err;
        }
        if (ord) {
          order.matched = true;
          const query = (({ type, price, stock }) => ({ type, price, stock }))(
            ord
          );
          DB.Models.Order.updateOne(
            query,
            { $set: { matched: true } },
            (er, upord) => {
              if (er) {
                throw er;
              }
            }
          );
        }
        const newOrder: IOrder = new DB.Models.Order(order);
        newOrder.save((er, or) => {
          if (er) {
            throw er;
          }
          if (or && or.matched) {
            const newTrade: ITrade = new DB.Models.Trade({
              sell_id: ord._id,
              buy_id: or._id,
              date: new Date().toLocaleDateString()
            });
            newTrade.save();
          }
          res.json(ord);
        });
      };
      const FindMatch = (ordQuery: any, cb: (err, ord) => void) => {
        DB.Models.Order.findOne(ordQuery, {}, cb);
      };
      FindMatch(orderQuery, callback);
    } catch (ex) {
      res.status(500);
      res.send(ex);
    }
  }

  public GetAll(req: Request, res: Response) {
    const query = req.query || {};
    DB.Models.Order.find(query, {}, (err, ords) => {
      if (err) {
        res.status(500);
        res.send(err);
      }
      res.json(ords);
    });
  }
}
