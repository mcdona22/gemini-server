import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { Server } from 'http';
import { ConfigModule } from '@nestjs/config';

describe('Throttling behaviour (e2e)', () => {
  const endPoint = 'api/v1';
  let app: INestApplication;
  let httpServer: Server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        await ConfigModule.forRoot({
          isGlobal: true, // Ensures ConfigService is available across all feature modules
        }),
      ],
    }).compile();

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
        .expect(200)
        .expect('Hello World!');
    });

    it('/ (GET)', () => {
      return request(app.getHttpServer()).get('/').expect(404);
    });
    it('should NOT throttle requests when thresholds exceeded', async () => {
      const limit = 3;
      for (let i = 0; i < limit; ++i) {
        const res = await request(httpServer).get(rootEndPoint);
        expect(res.statusCode).to.equal(200);
      }
      const throttledRes = await request(httpServer).get(rootEndPoint);
      expect(throttledRes.status).toBe(HttpStatus.OK);
    });
  });

  describe('Receipt Endpoint: partial throttling', async () => {
    const receiptEndpoint = `/${endPoint}/receipt`;
    it('should return the GET data correctly', async () => {
      return request(httpServer)
        .get(receiptEndpoint)
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect((response) => {
          expect(response.body).toHaveProperty('message', 'Hello Receipt');
        });
    });
    it('should return the POST data correctly', async () => {
      return request(httpServer)
        .post(receiptEndpoint)
        .expect(HttpStatus.CREATED)
        .expect('Content-Type', /json/)
        .expect((response) => {
          expect(response.body).toHaveProperty('message', 'POST RECEIVED');
        });
    });

    it('should NOT throttle the GET endpoint', async () => {
      const limit = 3;
      for (let i = 0; i < limit; ++i) {
        const res = await request(httpServer).get(receiptEndpoint);
        expect(res.statusCode).to.equal(200);
      }
      const throttledRes = await request(httpServer).get(receiptEndpoint);
      expect(throttledRes.status).toBe(HttpStatus.OK);
    });

    it('should throttle the POST endpoint', async () => {
      const limit = 3;
      for (let i = 0; i < limit; ++i) {
        const res = await request(httpServer).post(receiptEndpoint);
        expect(res.statusCode).to.equal(HttpStatus.CREATED);
      }
      const throttledRes = await request(httpServer).post(receiptEndpoint);
      expect(throttledRes.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
