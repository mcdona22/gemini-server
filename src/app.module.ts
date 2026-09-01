import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ReceiptModule } from './features/receipt/receipt.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ReceiptModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env'
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
