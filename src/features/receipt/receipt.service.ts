import { Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service.js';
import { CreateReceiptDto } from '../../../dist/features/receipt/dto/create-receipt.dto.js';

@Injectable()
export class ReceiptService {
  constructor(private geminiService: GeminiService) {}

  create(createReceiptDto: CreateReceiptDto) {
    return 'This action adds a new receipt';
  }

  async analyseReceipt(buffer: Buffer, mimetype: string) {
    return this.geminiService.analyseReceipt(buffer, mimetype);
  }
}
