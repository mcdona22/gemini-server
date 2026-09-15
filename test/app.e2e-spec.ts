import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { Server } from 'http';
import { ConfigService } from '@nestjs/config';
import { ReceiptService } from '../src/feature/receipt/receipt.service.js';
import { mockReceiptData } from '../src/test-data/mock-receipts.js';

describe('Throttling behaviour (e2e)', () => {
  const endPoint = 'api/v1';
  let app: INestApplication;
  let httpServer: Server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        getOrThrow: (key: string) => {
          if (key === 'GEMINI_API_KEY') return 'mock-e2e-gemini-key';
          throw new Error(`Unmocked key requested: ${key}`);
        },
        get: (key: string) => '30000',
      })
      .overrideProvider(ReceiptService) // <-- Add this override!
      .useValue({
        analyseFile: vi.fn().mockResolvedValue(mockReceiptData),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix(endPoint);
    httpServer = app.getHttpServer() as Server;
    await app.init();
  });

  describe('Root endpoint', () => {
    const rootEndPoint = `/${endPoint}`;
    it('/ (GET) - response quality', () => {
      return request(httpServer)
        .get(rootEndPoint)
        .expect(HttpStatus.OK)
        .expect('Hello World!');
    });

    describe('Receipt endpoint', () => {
      const receiptEndPoint = `/${endPoint}/receipt`;
      const analyseUrl = `/api/v1/receipt/analyse`;

      it('should respond with 200 for noddy GET', async () => {
        return request(httpServer).get(receiptEndPoint).expect(HttpStatus.OK);
      });

      it('should respond with 201 for POST', async () => {
        return request(httpServer)
          .post(receiptEndPoint)
          .expect(HttpStatus.CREATED);
      });

      it('should not throttle POST within the limit', async () => {
        const limit = 3;
        const dummyFileBuffer = Buffer.from('mock image payload');

        for (let i = 0; i < limit; ++i) {
          const response = await request(httpServer)
            .post(analyseUrl)
            .attach('file', dummyFileBuffer, 'receipt.jpeg');

          expect(response.statusCode).to.equal(HttpStatus.CREATED);
        }
      });

      it('should  throttle POST in excess of the limit', async () => {
        const limit = 3;
        const dummyFileBuffer = Buffer.from('mock image payload');

        for (let i = 0; i < limit; ++i) {
          const response = await request(httpServer)
            .post(analyseUrl)
            .attach('file', dummyFileBuffer, 'receipt.jpeg');

          expect(response.statusCode).to.equal(HttpStatus.CREATED);
        }

        const response = await request(httpServer)
          .post(analyseUrl)
          .attach('file', dummyFileBuffer, 'receipt.jpeg');
        expect(response.statusCode).to.equal(HttpStatus.TOO_MANY_REQUESTS);
      });
    });

    // it('GET should NOT throttle requests when thresholds exceeded', async () => {
    //   const limit = 3;
    //   for (let i = 0; i < limit; ++i) {
    //     const res = await request(httpServer).get(rootEndPoint);
    //     expect(res.statusCode).to.equal(HttpStatus.OK);
    //   }
    //   const throttledRes = await request(httpServer).get(rootEndPoint);
    //   expect(throttledRes.status).toBe(HttpStatus.OK);
    // });
  });

  // describe('POST on root endpoint should be throttled', async () => {
  //   const receiptEndpoint = `/${endPoint}/receipt`;
  //   const analyseEndpoint = `/${receiptEndpoint}/analyse`;
  //
  //   it('should return the POST data correctly', async () => {
  //     return (
  //       request(httpServer)
  //         .get('/api/v1')
  //         .expect(HttpStatus.OK)
  //         // .expect('Content-Type', /json/)
  //         .expect((response) => {
  //           expect(response.body).toHaveProperty('message', 'POST RECEIVED');
  //         })
  //     );
  //   });
  //
  //   // it.skip('should return the POST data correctly', async () => {
  //   //   return request(httpServer)
  //   //     .post(receiptEndpoint)
  //   //     .expect(HttpStatus.CREATED)
  //   //     .expect('Content-Type', /json/)
  //   //     .expect((response) => {
  //   //       expect(response.body).toHaveProperty('message', 'POST RECEIVED');
  //   //     });
  //   // });
  //
  //   // it('should NOT throttle the GET endpoint', async () => {
  //   //   const limit = 3;
  //   //   for (let i = 0; i < limit; ++i) {
  //   //     const res = await request(httpServer).get(receiptEndpoint);
  //   //     expect(res.statusCode).to.equal(200);
  //   //   }
  //   //   const throttledRes = await request(httpServer).get(receiptEndpoint);
  //   //   expect(throttledRes.status).toBe(HttpStatus.OK);
  //   // });
  //
  //   it('should throttle the POST endpoint', async () => {
  //     const limit = 3;
  //     const dummyFileBuffer = Buffer.from('mock image payload');
  //     for (let i = 0; i < limit; ++i) {
  //       const res = await request(httpServer)
  //         .post('/api/v2/receipt/analyse/')
  //         .attach('file', dummyFileBuffer, 'test-receipt.jpg');
  //       expect(res.statusCode).to.equal(HttpStatus.CREATED);
  //     }
  //     const throttledRes = await request(httpServer).post(receiptEndpoint);
  //     expect(throttledRes.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
  //   });
  // });

  afterEach(async () => {
    await app.close();
  });
});
