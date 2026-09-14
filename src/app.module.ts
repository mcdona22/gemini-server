import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ThrottlerModule } from '@nestjs/throttler';
import { ReceiptController } from './feature/receipt/receipt.controller.js';
import { ReceiptService } from './feature/receipt/receipt.service.js';
import { GeminiService } from './feature/gemini/gemini.service.js';

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
  providers: [AppService, ReceiptService, GeminiService],
})
export class AppModule {}
