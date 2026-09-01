import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ReceiptModule } from './features/receipt/receipt.module.js';

@Module({
  imports: [ReceiptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
