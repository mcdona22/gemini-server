import { AppService } from './app.service.js';
import { Test } from '@nestjs/testing';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('should invoke method', () => {
    const response = appService.getHello();
    expect(response).toBe('Hello World!');
  });
});
