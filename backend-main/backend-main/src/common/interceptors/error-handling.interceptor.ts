import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ErrorHandlingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                const request = context.switchToHttp().getRequest();
                const method = request.method;
                const url = request.url;

                const stackLines = error.stack?.split('\n') ?? [];
                const firstStackLine = stackLines.length > 3 ? stackLines[3].trim() : 'No stack trace available';

                this.logger.error({
                    error: error.message,
                    location: firstStackLine,
                    request: `${method} ${url}`,
                    statusCode: error.status,
                });

                if (error instanceof HttpException) {
                    return throwError(() => error);
                }

                return throwError(() => new InternalServerErrorException('Internal server error, check the logs'));
            })
        );
    }
}