import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);

  async analyseReceipt(
    fileBuffer: Buffer,
    mimeType = 'image/jpeg',
  ): Promise<Record<string, any>> {
    this.logger.debug('Processing image for OCR optimization...');

    return {};
  }
}
