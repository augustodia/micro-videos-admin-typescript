import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories/categories.providers';
import { CreateCategoryFixture } from '../../src/nest-modules/categories/testing/fixture/category.fixture';
import { applyGlobalConfig } from '../../src/nest-modules/global-config';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let categoryRepo: ICategoryRepository;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    categoryRepo = app.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });
  describe('/categories (POST)', () => {
    const arrange = CreateCategoryFixture.arrangeForCreate();

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const res = await request(app.getHttpServer())
          .post('/categories')
          .send(send_data)
          .expect(201);

        const keysInResponse = CreateCategoryFixture.keysInResponse;
        expect(Object.keys(res.body)).toStrictEqual(['data']);
        // const presenter = await controller.create(send_data);
        // const entity = await repository.findById(new Uuid(presenter.id));
        // expect(entity.toJSON()).toStrictEqual({
        //   category_id: presenter.id,
        //   created_at: presenter.created_at,
        //   ...expected,
        // });
        // const output = CategoryOutputMapper.toOutput(entity);
        // expect(presenter).toEqual(new CategoryPresenter(output));
      },
    );
  });
  //   let app: INestApplication;

  //   beforeEach(async () => {
  //     const moduleFixture: TestingModule = await Test.createTestingModule({
  //       imports: [AppModule],
  //     }).compile();

  //     app = moduleFixture.createNestApplication();
  //     await app.init();
  //   });

  //   it('/ (GET)', () => {
  //     return request(app.getHttpServer())
  //       .get('/')
  //       .expect(200)
  //       .expect('Hello World!');
  //   });
});
