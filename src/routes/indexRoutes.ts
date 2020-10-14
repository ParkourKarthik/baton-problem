import { Request, Response } from 'express';
import { OrderController } from '../controllers/order';
import express from 'express';

export class Routes {
  public orderController: OrderController = new OrderController();

  public routes(app: express.Application): void {
    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'GET request successfulll!!!!'
      });
    });

    app
      .route('/order')
      .get(this.orderController.GetAll)
      .post(this.orderController.Add);
  }
}
