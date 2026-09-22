import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CustomThrottlerGuard } from './guards/custom-throttler.guard.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    })

      .overrideGuard(CustomThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return release info"', () => {
      const response = appController.getHello();
      expect(response.version).toBe('1.0.1');
      expect(response.description).toBeTruthy();
    });
  });
});
