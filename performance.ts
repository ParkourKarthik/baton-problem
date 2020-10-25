/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import loadtest from 'loadtest';
import { should } from 'chai';
should();

describe('Performance Test', function () {
  const noRequestPerHour = 100000;
  const avgRequestTime = 1000;

  const host = 'http://localhost:8080';

  it('performance testing /order', function (done) {
    this.timeout(1000 * 60);

    const options = {
      url: host + '/order',
      maxSeconds: 30,
      concurrency: 25,
      statusCallback: statusCallback
    };

    let gLatency: any;

    function statusCallback(error: any, result: any, latency: any) {
      gLatency = latency;
    }

    const operation: any = loadtest.loadTest(options, function (error: any) {
      if (error) {
        console.error('Got an error: %s', error);
      } else if (operation.running == false) {
        logDetails(gLatency, done, noRequestPerHour, avgRequestTime);
      }
    });
  });

  it('performance testing /trades', function (done) {
    this.timeout(1000 * 60);

    const options = {
      url: host + '/trades',
      maxSeconds: 30,
      concurrency: 25,
      statusCallback: statusCallback
    };

    let gLatency: any;

    function statusCallback(error: any, result: any, latency: any) {
      gLatency = latency;
    }

    const operation: any = loadtest.loadTest(options, function (error: any) {
      if (error) {
        console.error('Got an error: %s', error);
      } else if (operation.running == false) {
        logDetails(gLatency, done, noRequestPerHour, avgRequestTime);
      }
    });
  });

  const logDetails = (
    gLatency: {
      totalRequests: number;
      totalErrors: number;
      rps: number;
      meanLatencyMs: any;
      minLatencyMs: any;
      maxLatencyMs: any;
      percentiles: any;
    },
    done: { (err?: any): void; (err?: any): void; (): void },
    noRequestPerHour: number,
    avgRequestTime: number
  ) => {
    console.info(
      '\n=========================================================================================================\n'
    );
    console.info(
      '\tThreshold : No of request per hour = ' +
        noRequestPerHour +
        ', Avg request time in millis = ' +
        avgRequestTime
    );
    console.info(
      '\n=========================================================================================================\n'
    );
    console.info('Total Requests :', gLatency.totalRequests);
    console.info('Total Failures :', gLatency.totalErrors);
    console.info('Requests Per Second :', gLatency.rps);
    console.info('Requests Per Hour :', gLatency.rps * 3600);
    console.info('Average Request Time(Mills) :', gLatency.meanLatencyMs);
    console.info('Minimum Request Time(Mills) :', gLatency.minLatencyMs);
    console.info('Maximum Request Time(Mills) :', gLatency.maxLatencyMs);
    console.info('Percentiles :', gLatency.percentiles);
    console.info(
      '\n=========================================================================================================\n'
    );

    gLatency.totalErrors.should.equal(0);
    (gLatency.rps * 3600).should.be.greaterThan(noRequestPerHour);
    gLatency.meanLatencyMs.should.be.below(avgRequestTime);

    done();
  };
});
