import {
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: any,
  ): Promise<void> {
    const logger = new Logger('CustomThrottlerGuard');
    const response = context.switchToHttp().getResponse();

    response.status(HttpStatus.TOO_MANY_REQUESTS).json({
      status: HttpStatus.TOO_MANY_REQUESTS,
      error: 'Too many request',
      message: 'Rate limit exceeded.  Please wait before retrying',
      ttl: throttlerLimitDetail.ttl,
    });

    throw new ThrottlerException('Rate limit exceeded');
  }
}
