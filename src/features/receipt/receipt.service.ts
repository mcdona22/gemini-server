import { Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service.js';

@Injectable()
export class ReceiptService {
  constructor(private geminiService: GeminiService) {}

  async analyseReceipt(buffer: Buffer, mimetype: string) {
    return this.geminiService.analyseReceipt(buffer, mimetype);
  }
}
