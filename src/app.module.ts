import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ReceiptModule } from './features/receipt/receipt.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ReceiptModule,
    // ThrottlerModule.forRoot([
    //   { name: 'short', ttl: 1000, limit: 3 },
    //   { name: 'long', ttl: 10000, limit: 20 },
    // ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: CustomThrottlerGuard,
    // },
  ],
})
export class AppModule {}
