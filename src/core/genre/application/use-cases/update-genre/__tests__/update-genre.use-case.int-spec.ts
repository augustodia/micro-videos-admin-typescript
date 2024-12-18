import {
  UpdateGenreOutput,
  UpdateGenreUseCase,
} from '../update-genre.use-case';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { GenreId } from '../../../../domain/genre.aggregate';

import { UpdateGenreInput } from '../update-genre.input';
import { GenreSequelizeRepository } from '../../../../infra/db/sequelize/genre-sequelize.repository';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { CategoriesIdExistsInDatabaseValidator } from '@core/category/application/validations/categories-ids-exists-in-database.validator';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../../../infra/db/sequelize/genre-model';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { UnitOfWorkSequelize } from '@core/shared/infra/db/sequelize/unit-of-work.sequelize';
import { CategoryFakeBuilder } from '@core/category/domain/category-fake.builder';
import { GenreFakeBuilder } from '@core/genre/domain/genre-fake.builder';

describe('UpdateGenreUseCase Integration Tests', () => {
  let uow: UnitOfWorkSequelize;
  let useCase: UpdateGenreUseCase;
  let genreRepo: GenreSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;
  let categoriesIdsExistsInStorageValidator: CategoriesIdExistsInDatabaseValidator;

  const sequelizeHelper = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    categoriesIdsExistsInStorageValidator =
      new CategoriesIdExistsInDatabaseValidator(categoryRepo);
    useCase = new UpdateGenreUseCase(
      uow,
      genreRepo,
      categoryRepo,
      categoriesIdsExistsInStorageValidator,
    );
  });

  it('should update a genre', async () => {
    const categories = CategoryFakeBuilder.theCategories(3).build();
    await categoryRepo.bulkInsert(categories);
    const entity = GenreFakeBuilder.aGenre()
      .addCategoryId(categories[1].category_id)
      .build();
    await genreRepo.insert(entity);

    let output = await useCase.execute(
      new UpdateGenreInput({
        id: entity.genre_id.id,
        name: 'test',
        categories_ids: [categories[0].category_id.id],
      }),
    );
    expect(output).toStrictEqual({
      id: entity.genre_id.id,
      name: 'test',
      categories: expect.arrayContaining(
        [categories[0]].map((e) => ({
          id: e.category_id.id,
          name: e.name,
          created_at: e.created_at,
        })),
      ),
      categories_ids: expect.arrayContaining([categories[0].category_id.id]),
      is_active: true,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: UpdateGenreInput;
      expected: UpdateGenreOutput;
    };

    const arrange: Arrange[] = [
      {
        input: {
          id: entity.genre_id.id,
          categories_ids: [
            categories[1].category_id.id,
            categories[2].category_id.id,
          ],
          is_active: true,
        },
        expected: {
          id: entity.genre_id.id,
          name: 'test',
          categories: expect.arrayContaining(
            [categories[1], categories[2]].map((e) => ({
              id: e.category_id.id,
              name: e.name,
              created_at: e.created_at,
            })),
          ),
          categories_ids: expect.arrayContaining([
            categories[1].category_id.id,
            categories[2].category_id.id,
          ]),
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.genre_id.id,
          name: 'test changed',
          categories_ids: [
            categories[1].category_id.id,
            categories[2].category_id.id,
          ],
          is_active: false,
        },
        expected: {
          id: entity.genre_id.id,
          name: 'test changed',
          categories: expect.arrayContaining(
            [categories[1], categories[2]].map((e) => ({
              id: e.category_id.id,
              name: e.name,
              created_at: e.created_at,
            })),
          ),
          categories_ids: expect.arrayContaining([
            categories[1].category_id.id,
            categories[2].category_id.id,
          ]),
          is_active: false,
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute(i.input);
      const entityUpdated = await genreRepo.findById(new GenreId(i.input.id));
      expect(output).toStrictEqual({
        id: entity.genre_id.id,
        name: i.expected.name,
        categories: i.expected.categories,
        categories_ids: i.expected.categories_ids,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
      expect(entityUpdated!.toJSON()).toStrictEqual({
        genre_id: entity.genre_id.id,
        name: i.expected.name,
        categories_ids: i.expected.categories_ids,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
    }
  });

  it('rollback transaction', async () => {
    const category = CategoryFakeBuilder.aCategory().build();
    await categoryRepo.insert(category);
    const entity = GenreFakeBuilder.aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(entity);

    GenreModel.afterBulkUpdate('hook-test', () => {
      return Promise.reject(new Error('Generic Error'));
    });

    await expect(
      useCase.execute(
        new UpdateGenreInput({
          id: entity.genre_id.id,
          name: 'test',
          categories_ids: [category.category_id.id],
        }),
      ),
    ).rejects.toThrow(new Error('Generic Error'));

    GenreModel.removeHook('afterBulkUpdate', 'hook-test');

    const notUpdatedGenre = await genreRepo.findById(entity.genre_id);
    expect(notUpdatedGenre!.name).toStrictEqual(entity.name);
  });
});
