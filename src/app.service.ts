import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    const version = '1.0.1';
    const description = 'New ai model';
    const modelVersion = 'gemini-3.5-flash-lite';
    return { version, description, modelVersion };
  }
}
