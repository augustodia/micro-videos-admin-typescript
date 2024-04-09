import { ConfigModule } from '../config/config.module';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { DatabaseModule } from '../database/database.module';
import { CategoriesModule } from './categories.module';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
      /* PODE SER FEITO ASSIM, CASO NÃO QUEIRA MONTAR O MÓDULO INTEIRO PARA TESTAR O CONTROLLER
       * imports: [DatabaseModule, SequelizeModule.forFeature([CategoryModel])],
       * controllers: [CategoriesController],
       * providers: [
       *   {
       *     provide: CategorySequelizeRepository,
       *     useFactory: (categoryModel: typeof CategoryModel) =>
       *       new CategorySequelizeRepository(categoryModel),
       *     inject: [getModelToken(CategoryModel)],
       *   },
       * ],
       */
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
