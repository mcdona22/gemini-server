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
    it('options on app root url', () => {
      return request(httpServer).options(rootEndPoint).expect(HttpStatus.OK);
    });

    describe('Receipt endpoint', () => {
      const receiptEndPoint = `/${endPoint}/receipt`;
      const analyseUrl = `/api/v1/receipt/analyse`;
      const dummyFileBuffer = Buffer.from('mock image payload');

      const postAnalyseRequest = (url: string) =>
        request(httpServer)
          .post(url)
          .attach('file', dummyFileBuffer, 'receipt.jpeg');

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

        for (let i = 0; i < limit; ++i) {
          const response = await postAnalyseRequest(analyseUrl);
          expect(response.statusCode).to.equal(HttpStatus.CREATED);
        }
      });

      it('should throttle POST in excess of the limit', async () => {
        const limit = 3;

        for (let i = 0; i < limit; ++i) {
          const response = await postAnalyseRequest(analyseUrl);
          expect(response.statusCode).to.equal(HttpStatus.CREATED);
        }

        const throttledResponse = await postAnalyseRequest(analyseUrl);
        expect(throttledResponse.statusCode).to.equal(
          HttpStatus.TOO_MANY_REQUESTS,
        );
      });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
