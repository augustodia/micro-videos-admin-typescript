import { getConnectionToken } from '@nestjs/sequelize';
import { MigrationsModule } from './nest-modules/database-module/migrations.module';
import { migrator } from './core/shared/infra/db/sequelize/migrator';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(MigrationsModule, {
    logger: ['error'],
  });

  const sequelize = app.get(getConnectionToken());

  migrator(sequelize).runAsCLI();
}
bootstrap();
