import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptController } from './receipt.controller.js';
import { ReceiptService } from './receipt.service.js';
import { GeminiService } from '../gemini/gemini.service.js';

describe('Receipt Controller Smoke Test', () => {
  let app: INestApplication;
  let receiptService: ReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptController],
      providers: [
        ReceiptService,
        {
          provide: GeminiService,
          useValue: {
            // Add mocked methods used by ReceiptService
            generateContent: vi.fn().mockResolvedValue('mocked response'),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    receiptService = module.get<ReceiptService>(ReceiptService);
    await app.init();
  });

  // afterEach(async () => await app.close());

  it('should run this test', async () => {
    console.log(`Test ran`);
    expect(true).toBe(true);
  });
});
