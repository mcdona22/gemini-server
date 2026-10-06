import { Controller, Get, HttpCode, Logger } from '@nestjs/common';

@Controller('meta')
export class MetaController {
  logger = new Logger(MetaController.name);

  @Get()
  @HttpCode(204)
  responseCheck() {
    this.logger.log('responding to performance check');
    return;
  }
}
