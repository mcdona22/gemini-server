import { Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { processReceiptForOcr } from './impage-proceesing-util.js';
import { RECEIPT_PROMPT } from './receipt.prompt.js';
import { receiptResponseSchema } from './receipt.schema.js';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger('GeminiService.name');
  private readonly ai: GoogleGenAI;
  private readonly modelVersion = 'gemini-3.6-flash'; // Updated model target
  private readonly requestTimeoutMs = 30000;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyseReceipt(fileBuffer: Buffer, mimeType = 'image/jpeg') {
    this.logger.debug('Processing image for OCR optimization...');
    const processedBuffer = await processReceiptForOcr(fileBuffer);

    this.logger.debug(
      `Analyzing receipt with timeout of ${this.requestTimeoutMs / 1000}s`,
    );
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.requestTimeoutMs);

    try {
      const response = await this.ai.models.generateContent({
        model: this.modelVersion,
        contents: [
          RECEIPT_PROMPT,
          {
            inlineData: {
              mimeType: mimeType,
              data: processedBuffer.toString('base64'),
            },
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: receiptResponseSchema,
          temperature: 0.0,
        },
      });
      clearTimeout(timer);

      if (!response.text) {
        throw new Error('Empty response received from backend service');
      }
      const receiptDto = JSON.parse(response.text);
      this.logger.debug('Analysis successfully completed');
      return receiptDto;
    } catch (error: unknown) {
      clearTimeout(timer);
      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.error('Receipt processing timed out');
        throw new RequestTimeoutException('Analysis took too long');
      }
      this.logger.error(
        `Receipt processing failed ${(error as Error).message}`,
      );
      throw error;
    }
  }
}
