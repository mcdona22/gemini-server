import { Controller, Get, Logger } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor() {}

  @Throttle({ short: { ttl: 10000, limit: 3 } })
  @Get()
  getHello() {
    this.logger.debug('saying hello');
    const msg: string = 'hello world!';
    return { msg };
  }
}
