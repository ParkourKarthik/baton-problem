process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import DB from '../controllers/db';
import app from '../app';
import { Type } from '../models/order';
const should = chai.should();
const endpoint = '/trade';

chai.use(chaiHttp);
describe('Trades', () => {
  beforeEach(done => {
    DB.Models.Order.deleteMany({}, _err => {
      done();
    });
  });
  describe('/GET trade', () => {
    beforeEach(done => {
      const orders = [
        { party: 'Party A', type: Type.SELL, stock: 'IBM', price: '110' },
        { party: 'Party A', type: Type.SELL, stock: 'INFY', price: '600' },
        { party: 'Party A', type: Type.SELL, stock: 'GOOG', price: '500' },
        { party: 'Party B', type: Type.BUY, stock: 'IBM', price: '110' },
        { party: 'Party C', type: Type.BUY, stock: 'GOOG', price: '500' }
      ];

      const resolveSequential = async orders => {
        for (const order of orders) {
          await DB.Models.Order.create<any>(order);
        }
      };
      resolveSequential(orders).then(() => {
        done();
      });
    });
    it('it should GET all the trades', done => {
      chai
        .request(app)
        .get(endpoint)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
          res.body[0].should.be.a('object');
          res.body[0].should.have.property('buyer');
          res.body[0].should.have.property('seller');
          res.body[0].should.have.property('stock');
          res.body[0].should.have.property('price');
          res.body[0].should.have.property('date');
          done();
        });
    });
    const filterFields = {
      stock: { query: 'IBM', count: 1 },
      party: { query: 'Party+C', count: 1 },
      date: { query: new Date().toLocaleDateString(), count: 1 }
    };
    for (const key in filterFields) {
      it(`it should GET filter based on ${key}`, done => {
        chai
          .request(app)
          .get(`${endpoint}?${key}=${filterFields[key].query}`)
          .end((err, res) => {
            res.should.have.status(200);
            console.log('res.body', res.body);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(filterFields[key].count);
            done();
          });
      });
    }
  });
});
