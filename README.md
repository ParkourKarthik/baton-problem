# Problem:
Implement a high frequency Exchange that receives both BUY orders & SELL orders and matches them based on the Symbol, Price and the sequence in which they were received. For each successful match, it creates a "Trade" record between the two parties that includes the two parties (Buyer & Seller) along with attributes such as the Symbol, Price, Trade Date, etc.

E.g.
Given an orders feed with the following rows:
Party A, SELL, IBM, 110
Party A, SELL, INFY, 600
Party A, SELL, GOOG, 500
Party B, BUY, IBM, 110
Party C, BUY, IBM, 110
Party C, BUY, INFY, 600

The following two matched trades will be created:

Trade 1:
>Seller = Party A, Buyer = Party B, Stock = IBM, Price = 110, Trade Date = 06/26/2020

Trade 2:
>Seller = Party A, Buyer = Party C, Stock = INFY, Price = 600, Trade Date = 06/26/2020

You can assume any channel in which these orders are being fed into the Exchange - a Queue, HTTP end-point or even a mock interface. Please assume large volumes of orders coming in through the channel at a short time. Hence care must be taken to design the matching system to have high throughput.

Expose two REST end-points for the end-users to query:
1. List of trades with the ability to filter based on Parties, SYMBOL or Date
2. List of orders that are not yet matched, with the ability to filter based on SYMBOL, Price

# Commands
 Make sure you do `npm install` before using the below commands.

 ## Run the application
 ```shell
 npm start
 ```
## Run Automated tests
```shell
npm test
```
## Run performance test
**Server should be running**
```shell
npm run perf
```

# Consuming the API
While the API is running (`npm start`), it could be utilized through the below endpoints.
The API by default uses http://localhost:8080.

## /order POST
### json 
```json
{party: string, stock: string, price: number}
```
### example
```shell
curl -d '{"party": "Party A", "type": "BUY", "stock": "INFY", "price": 600}' -H "Content-Type: application/json" -X POST http://localhost:8080/order
```

## /order GET
### query params 
```json
{stock: string, price: number, matched: boolean}
```
### example
```shell
curl http://localhost:8080/order?matched=false
```

## /trade GET
### query params 
```json
{stock: string, party: number, date: date}
```
### example
```shell
curl http://localhost:8080/trade?date=2020-10-25
```

# Thoughts and decisions

## Technical stack & libraries
The technical stack includes Nodejs, expressjs, Typescript, Mongodb, Mongoose, Mocha, Chai, loadtest. The API uses in-memory database so the data won't persist after stopping the server from running.

## Schema & Model
I had used normalization between order and trade collections. The trade collection has only reference ids of the buyer and seller order. Also each order has an additional property of `matched` to make sure that the order is already not matched and to query orders that are unmatched.

## Automated testing
Automated testing is almost new to me including the frameworks used for that. I haven't had a realtime usage (efficiently) in my official projects.
The choice is completely based on popularity which inturn is based on performance and ease of use.

## Queueing Mechanism
Since the API is expected to have high throughput, I thought of having a Queueing mechanism before hitting the DB. I looked for an in-memory queueing library. But after a brief research, it is suggested that nodejs and Mongodb provides better throughput. There were also many hesitations such as "what if the db fails while using the queueing mechanism", so I dropped spending much time on it. I just added a performance test to verify the throughput.

## Environments
Different environments can be configured such as development, production and testing using the `NODE_ENV`. We can switch the DB or do other operations based on the environments. But for now I'm using in-memory db and hence there is not much need.