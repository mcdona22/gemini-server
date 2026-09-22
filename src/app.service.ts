import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    const version = '1.0.1';
    const description = 'Explicit exceptions implemented';
    return { version, description };
  }
}
