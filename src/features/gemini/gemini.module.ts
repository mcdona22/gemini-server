import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service.js';

@Module({
  providers: [GeminiService],
  exports: [GeminiService], // <-- Export so other modules can use it
})
export class GeminiModule {}
