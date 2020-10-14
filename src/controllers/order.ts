import { Request, Response } from 'express';
import DB from './db';

export class OrderController {
  public Add(req: Request, res: Response) {
    console.log('add', req.body);
    const newOrder = new DB.Models.Order(req.body);
    newOrder.save((err, ord) => {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        res.json(ord);
      }
    });
  }

  public GetAll(req: Request, res: Response) {
    DB.Models.Order.find({}, {}, (err, emp) => {
      if (err) {
        res.status(500);
        res.send(err);
      }
      res.json(emp);
    });
  }
}
