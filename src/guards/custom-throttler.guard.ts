import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

// @Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    // MUST return the result of super.canActivate(context)
    return super.canActivate(context);
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: any,
  ): Promise<void> {
    const logger = new Logger('CustomThrottlerGuard');
    logger.warn(
      `Rate limit triggered for path: ${context.switchToHttp().getRequest().url}`,
    );

    // Throwing ThrottlerException allows @nestjs/throttler to set headers
    // and lets NestJS handle the 429 response structure properly.
    throw new HttpException(
      {
        message: 'Rate limit exceeded. Please wait before retrying',
        error: 'Too many requests',
        status: HttpStatus.TOO_MANY_REQUESTS,
        ttl: throttlerLimitDetail.ttl,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
