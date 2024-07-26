import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { LoggersService } from 'src/shared/loggers';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly loggerService = new LoggersService();
  private logger = new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const now: number = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response: Response = context.switchToHttp().getResponse();
        const delay: number = Date.now() - now;

        let ip: string | string[] =
          request.headers?.['x-forwarded-for'] || request.ip;

        if (Array.isArray(ip)) {
          ip = ip.join(' ');
        }
        const user: any = request.user || null;
        `${method} ${url} ${response.statusCode} - ${ip} +${delay}ms`;
        this.loggerService.logVerbose(
          `==========phone/id: ${user?.phone || 'null'}/${user?.id || null}============`,
        );
      }),
    );
  }
}
