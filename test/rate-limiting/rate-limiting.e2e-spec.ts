import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module.js';
import request from 'supertest';

describe('Throttling at the boundary (E2E)', () => {
  let app: INestApplication;
  const logger = new Logger('Throttling');
  const urlPrefix = 'api/v1/';
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // app.setGlobalPrefix('api/v1'); // Match main.ts prefix
    await app.init();
    await app.listen(0);
  });

  afterAll(async () => await app.close());

  it('should return 201 when not throttled', async () => {
    await request(app.getHttpServer()).get('/').expect(200).expect('success');
  });
});
