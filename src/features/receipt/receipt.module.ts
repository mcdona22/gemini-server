import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service.js';
import { ReceiptController } from './receipt.controller.js';
import { GeminiModule } from '../gemini/gemini.module.js';

@Module({
  imports: [GeminiModule],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
