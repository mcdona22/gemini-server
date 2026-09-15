import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CustomThrottlerGuard } from '../../guards/custom-throttler.guard.js';
import { ReceiptService } from './receipt.service.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('receipt')
export class ReceiptController {
  logger = new Logger(ReceiptController.name);

  constructor(private readonly receiptService: ReceiptService) {}

  // @SkipThrottle()
  @Get()
  simpleGet(): any {
    const data = { message: 'Hello Receipt' };
    this.logger.debug(data);
    return data;
  }

  @Post()
  simplePost(): any {
    const data = { message: 'POST RECEIVED' };
    this.logger.debug(data);
    return data;
  }

  @Post('analyse')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(CustomThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 10000 } }) // Explicitly protects POST /api/v1/receipt
  async analyseFile(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file available');
    this.logger.debug('File received', file.originalname);
    try {
      this.logger.debug('Submitting file for analysis', file.originalname);

      return await this.receiptService.analyseFile(file.buffer, file.mimetype);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Receipt Analysis Failure',
          message: (error as Error).message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
