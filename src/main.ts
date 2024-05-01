import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WrapperDataInterceptor } from './nest-modules/interceptors/wrapper-data/wrapper-data.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app
    .useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: 422,
      }),
    )
    .useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
    .useGlobalInterceptors(new WrapperDataInterceptor());
  await app.listen(3000);
}
bootstrap();
