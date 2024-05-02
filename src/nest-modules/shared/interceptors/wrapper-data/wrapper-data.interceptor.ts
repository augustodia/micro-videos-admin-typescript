import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class WrapperDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((body) => (!body || 'meta' in body ? body : { data: body })));
  }
}
