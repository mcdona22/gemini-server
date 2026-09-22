import {
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { processReceiptForOcr } from './image-processing-util.js';
import {
  receiptResponseSchema,
  validateReceiptContract,
} from './receipt.schema.js';
import { RECEIPT_PROMPT } from './receipt.prompt.js';
import { GEMINI_CLIENT } from '../../app.module.js';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly modelVersion = 'gemini-3.5-flash-lite'; // Updated model target
  private readonly requestTimeoutMs = 30000;

  // constructor(private configService: ConfigService) {
  //   const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY');
  //   this.ai = new GoogleGenAI({ apiKey });
  // }

  constructor(@Inject('GEMINI_CLIENT') private readonly ai: GoogleGenAI) {}

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

      const isValid: boolean = validateReceiptContract(receiptDto);
      if (!isValid) {
        this.logger.warn('Failed validation for schema');
        this.logger.warn(validateReceiptContract.errors);
        throw new UnprocessableEntityException({
          message: 'Response payload failed contract validation',
          errors: validateReceiptContract.errors,
        });
      }
      this.logger.debug('Analysis successfully completed');
      return receiptDto;
    } catch (error: unknown) {
      clearTimeout(timer);
      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.error('Receipt processing timed out');
        throw new RequestTimeoutException('Analysis took too long');
      }

      if (error instanceof Error) {
        const isBusy = error.message.includes('This model is currently exper');
        this.logger.error('Overload', isBusy);
        throw new ServiceUnavailableException(
          'The service is experiencing heavy load',
        );
      }

      this.logger.error(
        `Receipt processing failed ${(error as Error).message}`,
      );

      throw error;
    }
  }
}
