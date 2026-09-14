import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { ReceiptController } from './feature/receipt/receipt.controller.js';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 3,
      },
    ]),
  ],
  controllers: [AppController, ReceiptController],
  providers: [AppService],
})
export class AppModule {}
