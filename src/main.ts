import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WrapperDataInterceptor } from './nest-modules/shared/interceptors/wrapper-data/wrapper-data.interceptor';
import { EntityValidationErrorFilter } from './nest-modules/shared/filters/entity-validation-error/entity-validation-error.filter';
import { NotFoundErrorFilter } from './nest-modules/shared/filters/not-found-error/not-found-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app
    .useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: 422,
      }),
    )
    .useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
    .useGlobalInterceptors(new WrapperDataInterceptor())
    .useGlobalFilters(new NotFoundErrorFilter())
    .useGlobalFilters(new EntityValidationErrorFilter());

  await app.listen(3000);
}
bootstrap();
