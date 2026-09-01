import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service.js';
import { ReceiptController } from './receipt.controller.js';

@Module({
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
