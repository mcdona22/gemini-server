import { Controller, Options, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { CustomThrottlerGuard } from './guards/custom-throttler.guard.js';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(CustomThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 10000 } })
  @Options()
  getHello() {
    return this.appService.getHello();
  }
}
