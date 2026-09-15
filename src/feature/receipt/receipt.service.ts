import { Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service.js';

@Injectable()
export class ReceiptService {
  constructor(private readonly geminiService: GeminiService) {}
  async analyseFile(
    buffer: Buffer,
    mimetype: string,
  ): Promise<Record<string, any>> {
    return this.geminiService.analyseReceipt(buffer, mimetype);
  }
}
