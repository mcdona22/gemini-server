import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttleLimitDetail: any,
  ): Promise<void> {
    throw new HttpException(
      {
        status: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Too many requests',
        message: 'Rate limit exceeded - try again later',
        ttl: throttleLimitDetail.ttl,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
