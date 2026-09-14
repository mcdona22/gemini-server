import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptController } from './receipt.controller.js';
import { ThrottlerModule } from '@nestjs/throttler';

describe('ReceiptController', () => {
  let controller: ReceiptController;

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
    }).compile();

    controller = module.get<ReceiptController>(ReceiptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should respond to GET', async () => {
    const data = controller.simpleGet();
    console.log(data);
    expect(data.message).toBe('Hello Receipt');
  });
});
