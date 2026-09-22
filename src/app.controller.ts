import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  // @UseGuards(CustomThrottlerGuard)
  // @Throttle({ default: { limit: 3, ttl: 10000 } })
  // getHello() {
  //   this.logger.log('Responding to OPTIONS');
  //   return this.appService.getInfo();
  // }

  @Get()
  simpleGet() {
    this.logger.log('Responding to GET');

    return this.appService.getInfo();
  }
}
