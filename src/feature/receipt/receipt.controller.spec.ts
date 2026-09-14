import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptController } from './receipt.controller.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { BadRequestException } from '@nestjs/common';
import { ReceiptService } from './receipt.service.js';
import { mockReceiptData } from '../../test-data/mock-receipts.js';

describe('ReceiptController', () => {
  let controller: ReceiptController;
  let receiptService: ReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            ttl: 1000,
            limit: 3,
          },
        ]),
      ],
      controllers: [ReceiptController],
      providers: [
        {
          provide: ReceiptService,
          useValue: {
            analyseFile: vi.fn().mockResolvedValue(mockReceiptData),
          },
        },
      ],
    }).compile();

    controller = module.get<ReceiptController>(ReceiptController);
    receiptService = module.get<ReceiptService>(ReceiptService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should respond to GET', async () => {
    const data = controller.simpleGet();
    console.log(data);
    expect(data.message).toBe('Hello Receipt');
  });

  describe('Analyse Receipt', async () => {
    it('should throw BadRequest if file is null', async () => {
      await expect(controller.analyseFile(null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return a dto if the receipt is good', async () => {
      const data = 'fake image here';
      const dummyBytes = Buffer.from(data);
      const result = await receiptService.analyseFile(dummyBytes, 'image/jpeg');

      expect(receiptService.analyseFile).toHaveBeenNthCalledWith(
        1,
        dummyBytes,
        'image/jpeg',
      );
      expect(result).toBe(mockReceiptData);
    });
  });
});
