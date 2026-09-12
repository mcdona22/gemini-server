import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptController } from './receipt.controller.js';
import { ReceiptService } from './receipt.service.js';
import { GeminiService } from '../gemini/gemini.service.js';

describe('Receipt Controller', () => {
  let app: INestApplication;
  let receiptService: ReceiptService;
  let geminiService: GeminiService;

  const mockReceiptData = {
    merchantName: 'Supermarket',
    totalAmount: 42.5,
    items: [
      { name: 'Milk', price: 1.5 },
      { name: 'Coffee', price: 41.0 },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptController],
      providers: [
        ReceiptService,
        {
          provide: GeminiService,
          useValue: {
            // Add mocked methods used by ReceiptService
            analyseReceipt: vi.fn().mockResolvedValue(mockReceiptData),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    receiptService = module.get<ReceiptService>(ReceiptService);
    geminiService = module.get<GeminiService>(GeminiService);
    await app.init();
  });

  afterEach(async () => await app.close());

  describe('Happy Path', () => {
    it('Analysis yields a good dto', async () => {
      const dummyBytes = Buffer.from('fake-image=bytes');

      const result = await receiptService.analyseReceipt(
        dummyBytes,
        'image/jpeg',
      );

      expect(geminiService.analyseReceipt).toHaveBeenNthCalledWith(
        1,
        dummyBytes,
        'image/jpeg',
      );

      expect(result).toEqual(mockReceiptData);
    });
  });
});
