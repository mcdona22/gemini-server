import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptService } from './receipt.service.js';
import { GeminiService } from '../gemini/gemini.service.js';
import { mockReceiptData } from '../../test-data/mock-receipts.js';

describe('ReceiptService', () => {
  let service: ReceiptService;
  let geminiService: GeminiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptService,
        {
          provide: GeminiService,
          useValue: {
            analyseReceipt: vi.fn().mockResolvedValue(mockReceiptData),
          },
        },
      ],
    }).compile();

    service = module.get<ReceiptService>(ReceiptService);
    geminiService = module.get<GeminiService>(GeminiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return a dto on the happy path', async () => {
    const mockImage = Buffer.from('Dont care');
    const mimeType = 'image/png';
    const result = await service.analyseFile(mockImage, mimeType);
    expect(geminiService.analyseReceipt).toHaveBeenNthCalledWith(
      1,
      mockImage,
      mimeType,
    );
    expect(result).toBe(mockReceiptData);
  });
});
