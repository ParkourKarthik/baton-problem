import DB from '../controllers/db';
import { Types } from 'mongoose';

/**
 * Default data inserted into employee table to show some data
 */
export const initData = () => {
  const p1 = DB.Models.Order.create({
    _id: new Types.ObjectId(),
    party: 'Party A',
    type: 'SELL',
    stock: 'IBM',
    price: '110'
  });
  const p2 = DB.Models.Order.create({
    _id: new Types.ObjectId(),
    party: 'Party A',
    type: 'SELL',
    stock: 'INFY',
    price: '600'
  });
  const p3 = DB.Models.Order.create({
    _id: new Types.ObjectId(),
    party: 'Party A',
    type: 'SELL',
    stock: 'GOOG',
    price: '500'
  });
  const p4 = DB.Models.Order.create({
    _id: new Types.ObjectId(),
    party: 'Party B',
    type: 'BUY',
    stock: 'IBM',
    price: '110'
  });
  return Promise.all([p1, p2, p3, p4]);
};
