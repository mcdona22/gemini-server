import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    const version = '1.0.2';
    const description = 'extract date from receipt';
    const modelVersion = 'gemini-3.5-flash-lite';
    return { version, description, modelVersion };
  }
}
