import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    const version = '1.0.0';
    const description = 'rate throttling added';
    return { version, description };
  }
}
