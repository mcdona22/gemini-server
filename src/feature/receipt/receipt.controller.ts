import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CustomThrottlerGuard } from '../../guards/custom-throttler.guard.js';
import { ReceiptService } from './receipt.service.js';

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
  @UseGuards(CustomThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 10000 } }) // Explicitly protects POST /api/v1/receipt
  simplePost(): any {
    const data = { message: 'POST RECEIVED' };
    this.logger.debug(data);
    return data;
  }

  async analyseFile(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file uploaded');
    try {
      this.logger.debug('Submitting file for analysis', file.name);

      return await this.receiptService.analyseFile(file.buffer, file.mimetype);
    } catch (error) {}
  }
}
