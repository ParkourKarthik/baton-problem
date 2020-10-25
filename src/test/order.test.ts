process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import DB from '../controllers/db';
import app from '../app';
import { Type } from '../models/order';
const should = chai.should();
const endpoint = '/order';

chai.use(chaiHttp);
describe('Orders', () => {
  beforeEach(done => {
    DB.Models.Order.deleteMany({}, _err => {
      done();
    });
  });

  describe('/POST order', () => {
    const requiredFields = ['price', 'stock', 'type', 'party'];
    const order = {};
    it(`it should not POST an order without ${requiredFields}`, done => {
      chai
        .request(app)
        .post(endpoint)
        .send(order)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');

          for (const field of requiredFields) {
            res.body.errors.should.have.property(field);
            res.body.errors[field].should.have.property('kind').eql('required');
          }
          done();
        });
    });

    it('it should POST a valid order', done => {
      const order = {
        party: 'Party B',
        type: Type.BUY,
        stock: 'IBM',
        price: '110'
      };
      chai
        .request(app)
        .post(endpoint)
        .send(order)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have
            .property('message')
            .eql('Order successfully added!');
          res.body.order.should.have.property('party');
          res.body.order.should.have.property('type');
          res.body.order.should.have.property('stock');
          res.body.order.should.have.property('price');
          done();
        });
    });
  });
  describe('/GET order', () => {
    beforeEach(done => {
      const orders = [
        { party: 'Party A', type: Type.SELL, stock: 'IBM', price: '110' },
        { party: 'Party A', type: Type.SELL, stock: 'INFY', price: '600' },
        { party: 'Party A', type: Type.SELL, stock: 'GOOG', price: '500' },
        { party: 'Party B', type: Type.BUY, stock: 'IBM', price: '110' }
      ];
      DB.Models.Order.insertMany(orders);
      done();
    });
    it('it should GET all the orders', done => {
      chai
        .request(app)
        .get(endpoint)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(4);
          done();
        });
    });
    const filterFields = {
      stock: { query: 'IBM', count: 2 },
      price: { query: 600, count: 1 }
    };
    for (const key in filterFields) {
      it(`it should GET filter based on ${key}`, done => {
        chai
          .request(app)
          .get(`${endpoint}?${key}=${filterFields[key].query}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(filterFields[key].count);
            done();
          });
      });
    }
  });
});
