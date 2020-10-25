import { Request, Response } from 'express';
import DB from './db';
import { IOrder} from '../models/order';

export class OrderController {
  public Add(req: Request, res: Response) {
    const order = req.body;
    try {
      const newOrder: IOrder = new DB.Models.Order(order);
      newOrder.save((er, or) => {
        if (er) {
          res.status(400).json(er);
          return;
        }
        res.send({ message: 'Order successfully added!', order: or });
      });
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
