import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ReceiptModule } from './features/receipt/receipt.module.js';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './guards/custom-throttler.guard.js';

@Module({
  imports: [
    ReceiptModule,
    ThrottlerModule.forRoot([{ name: 'short', ttl: 1000, limit: 3 }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
