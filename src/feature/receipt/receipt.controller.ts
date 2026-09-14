import { Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CustomThrottlerGuard } from '../../guards/custom-throttler.guard.js';

@Controller('receipt')
export class ReceiptController {
  logger = new Logger(ReceiptController.name);

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
}
