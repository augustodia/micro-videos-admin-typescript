import { CategoryFakeBuilder } from '../../../../../category/domain/category-fake.builder';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work.sequelize';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { GenreFakeBuilder } from '../../../../domain/genre-fake.builder';
import { Genre, GenreId } from '../../../../domain/genre.aggregate';
import {
  GenreSearchParams,
  GenreSearchResult,
} from '../../../../domain/genre.repository';
import { GenreCategoryModel, GenreModel } from '../genre-model';
import { GenreSequelizeRepository } from '../genre-sequelize.repository';
import { GenreModelMapper } from '../gere-model-mapper';

describe('GenreSequelizeRepository Integration Tests', () => {
  const sequelize = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });
  let uow: UnitOfWorkSequelize;
  let genreRepo: GenreSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;

  beforeEach(async () => {
    uow = new UnitOfWorkSequelize(sequelize.sequelize);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
  });

  it('should inserts a new entity', async () => {
    const category = CategoryFakeBuilder.aCategory().build();
    await categoryRepo.insert(category);
    const genre = GenreFakeBuilder.aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(genre);
    const newGenre = await genreRepo.findById(genre.genre_id);
    expect(newGenre!.toJSON()).toStrictEqual(genre.toJSON());
  });

  it('should bulk inserts new entities', async () => {
    const categories = CategoryFakeBuilder.theCategories(3).build();
    await categoryRepo.bulkInsert(categories);
    const genres = GenreFakeBuilder.theGenres(2)
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .addCategoryId(categories[2].category_id)
      .build();
    await genreRepo.bulkInsert(genres);
    const newGenres = await genreRepo.findAll();
    expect(newGenres.length).toBe(2);
    expect(newGenres[0].toJSON()).toStrictEqual({
      ...genres[0].toJSON(),
      categories_ids: expect.arrayContaining([
        categories[0].category_id.id,
        categories[1].category_id.id,
        categories[2].category_id.id,
      ]),
    });
    expect(newGenres[1].toJSON()).toStrictEqual({
      ...genres[1].toJSON(),
      categories_ids: expect.arrayContaining([
        categories[0].category_id.id,
        categories[1].category_id.id,
        categories[2].category_id.id,
      ]),
    });
  });

  it('should finds a entity by id', async () => {
    const category = CategoryFakeBuilder.aCategory().build();
    await categoryRepo.insert(category);
    const genre = GenreFakeBuilder.aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(genre);

    const entityFound = await genreRepo.findById(genre.genre_id);
    expect(genre.toJSON()).toStrictEqual(entityFound!.toJSON());

    await expect(genreRepo.findById(new GenreId())).resolves.toBeNull();
  });

  it('should return all categories', async () => {
    const category = CategoryFakeBuilder.aCategory().build();
    await categoryRepo.insert(category);
    const entity = GenreFakeBuilder.aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(entity);
    const entities = await genreRepo.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  it('should throw error on update when a entity not found', async () => {
    const entity = GenreFakeBuilder.aGenre().build();
    await expect(genreRepo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.genre_id.id, Genre),
    );
  });

  it('should update a entity', async () => {
    const categories = CategoryFakeBuilder.theCategories(3).build();
    await categoryRepo.bulkInsert(categories);
    const genre = GenreFakeBuilder.aGenre()
      .addCategoryId(categories[0].category_id)
      .build();
    await genreRepo.insert(genre);

    genre.changeName('Movie updated');
    genre.syncCategoriesIds([categories[1].category_id]);

    await genreRepo.update(genre);

    let entityFound = await genreRepo.findById(genre.genre_id);
    expect(genre.toJSON()).toStrictEqual(entityFound!.toJSON());
    await expect(GenreCategoryModel.count()).resolves.toBe(1);

    genre.addCategoryId(categories[0].category_id);
    await genreRepo.update(genre);

    entityFound = await genreRepo.findById(genre.genre_id);
    expect(genre.toJSON()).toStrictEqual({
      ...entityFound!.toJSON(),
      categories_ids: expect.arrayContaining([
        categories[0].category_id.id,
        categories[1].category_id.id,
      ]),
    });
  });

  it('should throw error on delete when a entity not found', async () => {
    const genreId = new GenreId();
    await expect(genreRepo.delete(genreId)).rejects.toThrow(
      new NotFoundError(genreId.id, Genre),
    );

    await expect(
      genreRepo.delete(new GenreId('9366b7dc-2d71-4799-b91c-c64adb205104')),
    ).rejects.toThrow(
      new NotFoundError('9366b7dc-2d71-4799-b91c-c64adb205104', Genre),
    );
  });

  it('should delete a entity', async () => {
    const category = CategoryFakeBuilder.aCategory().build();
    await categoryRepo.insert(category);
    const genre = GenreFakeBuilder.aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(genre);

    await genreRepo.delete(genre.genre_id);
    const genreFound = await GenreModel.findByPk(genre.genre_id.id);
    expect(genreFound).toBeNull();
    await expect(GenreCategoryModel.count()).resolves.toBe(0);
  });

  describe('search method tests', () => {
    it('should order by created_at DESC when search params are null', async () => {
      const categories = CategoryFakeBuilder.theCategories(3).build();
      await categoryRepo.bulkInsert(categories);
      const genres = GenreFakeBuilder.theGenres(16)
        .withCreatedAt((index) => new Date(new Date().getTime() + 100 + index))
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .build();
      await genreRepo.bulkInsert(genres);
      const spyToEntity = jest.spyOn(GenreModelMapper, 'toEntity');
      const searchOutput = await genreRepo.search(GenreSearchParams.create());
      expect(searchOutput).toBeInstanceOf(GenreSearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });

      [...genres.slice(1, 16)].reverse().forEach((item, index) => {
        expect(searchOutput.items[index]).toBeInstanceOf(Genre);
        const expected = searchOutput.items[index].toJSON();
        expect(item.toJSON()).toStrictEqual({
          ...expected,
          categories_ids: expect.arrayContaining([
            categories[0].category_id.id,
            categories[1].category_id.id,
            categories[2].category_id.id,
          ]),
        });
      });
    });

    it('should apply paginate and filter by name', async () => {
      const categories = CategoryFakeBuilder.theCategories(3).build();
      await categoryRepo.bulkInsert(categories);
      const genres = [
        GenreFakeBuilder.aGenre()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .build(),
        GenreFakeBuilder.aGenre()
          .withName('a')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .build(),
        GenreFakeBuilder.aGenre()
          .withName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 2000))
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .build(),
        GenreFakeBuilder.aGenre()
          .withName('TeSt')
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .build(),
      ];
      await genreRepo.bulkInsert(genres);

      let searchOutput = await genreRepo.search(
        GenreSearchParams.create({
          page: 1,
          per_page: 2,
          filter: { name: 'TEST' },
        }),
      );

      let expected = new GenreSearchResult({
        items: [genres[0], genres[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
      }).toJSON(true);
      expect(searchOutput.toJSON(true)).toMatchObject({
        ...expected,
        items: [
          {
            ...expected.items[0],
            categories_ids: expect.arrayContaining([
              categories[0].category_id.id,
              categories[1].category_id.id,
              categories[2].category_id.id,
            ]),
          },
          {
            ...expected.items[1],
            categories_ids: expect.arrayContaining([
              categories[0].category_id.id,
              categories[1].category_id.id,
              categories[2].category_id.id,
            ]),
          },
        ],
      });

      expected = new GenreSearchResult({
        items: [genres[3]],
        total: 3,
        current_page: 2,
        per_page: 2,
      }).toJSON(true);
      searchOutput = await genreRepo.search(
        GenreSearchParams.create({
          page: 2,
          per_page: 2,
          filter: { name: 'TEST' },
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject({
        ...expected,
        items: [
          {
            ...expected.items[0],
            categories_ids: expect.arrayContaining([
              categories[0].category_id.id,
              categories[1].category_id.id,
              categories[2].category_id.id,
            ]),
          },
        ],
      });
    });

    it('should apply paginate and filter by categories_ids', async () => {
      const categories = CategoryFakeBuilder.theCategories(4).build();
      await categoryRepo.bulkInsert(categories);
      const genres = [
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .withCreatedAt(new Date(new Date().getTime() + 2000))
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[3].category_id)
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
      ];
      await genreRepo.bulkInsert(genres);

      const arrange = [
        {
          params: GenreSearchParams.create({
            page: 1,
            per_page: 2,
            filter: { categories_ids: [categories[0].category_id.id] },
          }),
          result: {
            items: [genres[2], genres[1]],
            total: 3,
            current_page: 1,
            per_page: 2,
          },
        },
        {
          params: GenreSearchParams.create({
            page: 2,
            per_page: 2,
            filter: { categories_ids: [categories[0].category_id.id] },
          }),
          result: {
            items: [genres[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          },
        },
        {
          params: GenreSearchParams.create({
            page: 1,
            per_page: 2,
            filter: {
              categories_ids: [
                categories[0].category_id.id,
                categories[1].category_id.id,
              ],
            },
          }),
          result: {
            items: [genres[4], genres[2]],
            total: 4,
            current_page: 1,
            per_page: 2,
          },
        },
        {
          params: GenreSearchParams.create({
            page: 2,
            per_page: 2,
            filter: {
              categories_ids: [
                categories[0].category_id.id,
                categories[1].category_id.id,
              ],
            },
          }),
          result: {
            items: [genres[1], genres[0]],
            total: 4,
            current_page: 2,
            per_page: 2,
          },
        },
      ];
      for (const arrangeItem of arrange) {
        const searchOutput = await genreRepo.search(arrangeItem.params);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { items, ...otherOutput } = searchOutput;
        const { items: itemsExpected, ...otherExpected } = arrangeItem.result;
        expect(otherOutput).toMatchObject(otherExpected);
        expect(searchOutput.items.length).toBe(itemsExpected.length);
        searchOutput.items.forEach((item, key) => {
          const expected = itemsExpected[key].toJSON();
          expect(item.toJSON()).toStrictEqual(
            expect.objectContaining({
              ...expected,
              categories_ids: expect.arrayContaining(expected.categories_ids),
            }),
          );
        });
      }
    });

    it('should apply paginate and sort', async () => {
      expect(genreRepo.sortableFields).toStrictEqual(['name', 'created_at']);

      const categories = CategoryFakeBuilder.theCategories(4).build();
      await categoryRepo.bulkInsert(categories);
      const genres = [
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('b')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('a')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('d')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('e')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('c')
          .build(),
      ];
      await genreRepo.bulkInsert(genres);

      const arrange = [
        {
          params: GenreSearchParams.create({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
          }),
          result: new GenreSearchResult({
            items: [genres[1], genres[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: GenreSearchParams.create({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
          }),
          result: new GenreSearchResult({
            items: [genres[4], genres[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          params: GenreSearchParams.create({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new GenreSearchResult({
            items: [genres[3], genres[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: GenreSearchParams.create({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new GenreSearchResult({
            items: [genres[4], genres[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await genreRepo.search(i.params);
        const expected = i.result.toJSON(true);

        expect(result.toJSON(true)).toMatchObject({
          ...expected,
          items: expected.items.map((i) => ({
            ...i,
            categories_ids: expect.arrayContaining(i.categories_ids),
          })),
        });
      }
    });

    describe('should search using filter by name, sort and paginate', () => {
      const categories = CategoryFakeBuilder.theCategories(3).build();

      const genres = [
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('test')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('a')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('TEST')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('e')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('TeSt')
          .build(),
      ];

      const arrange = [
        {
          search_params: GenreSearchParams.create({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: { name: 'TEST' },
          }),
          search_result: new GenreSearchResult({
            items: [genres[2], genres[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: GenreSearchParams.create({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: { name: 'TEST' },
          }),
          search_result: new GenreSearchResult({
            items: [genres[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await categoryRepo.bulkInsert(categories);
        await genreRepo.bulkInsert(genres);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result: expected_result }) => {
          const result = await genreRepo.search(search_params);
          const expected = expected_result.toJSON(true);
          expect(result.toJSON(true)).toMatchObject({
            ...expected,
            items: expected.items.map((i) => ({
              ...i,
              categories_ids: expect.arrayContaining(i.categories_ids),
            })),
          });
        },
      );
    });

    describe('should search using filter by categories_ids, sort and paginate', () => {
      const categories = CategoryFakeBuilder.theCategories(4).build();

      const genres = [
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .withName('test')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .withName('a')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('TEST')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[3].category_id)
          .withName('e')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('TeSt')
          .build(),
      ];

      const arrange = [
        {
          search_params: GenreSearchParams.create({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: { categories_ids: [categories[0].category_id.id] },
          }),
          search_result: new GenreSearchResult({
            items: [genres[2], genres[1]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: GenreSearchParams.create({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: { categories_ids: [categories[0].category_id.id] },
          }),
          search_result: new GenreSearchResult({
            items: [genres[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await categoryRepo.bulkInsert(categories);
        await genreRepo.bulkInsert(genres);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result: expected_result }) => {
          const result = await genreRepo.search(search_params);
          const expected = expected_result.toJSON(true);
          expect(result.toJSON(true)).toMatchObject({
            ...expected,
            items: expected.items.map((i) => ({
              ...i,
              categories_ids: expect.arrayContaining(i.categories_ids),
            })),
          });
        },
      );
    });

    describe('should search using filter by name and categories_ids, sort and paginate', () => {
      const categories = CategoryFakeBuilder.theCategories(4).build();

      const genres = [
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .withName('test')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .withName('a')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[0].category_id)
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('TEST')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[3].category_id)
          .withName('e')
          .build(),
        GenreFakeBuilder.aGenre()
          .addCategoryId(categories[1].category_id)
          .addCategoryId(categories[2].category_id)
          .withName('TeSt')
          .build(),
      ];

      const arrange = [
        {
          search_params: GenreSearchParams.create({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: {
              name: 'TEST',
              categories_ids: [categories[1].category_id],
            },
          }),
          search_result: new GenreSearchResult({
            items: [genres[2], genres[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: GenreSearchParams.create({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc',
            filter: {
              name: 'TEST',
              categories_ids: [categories[1].category_id],
            },
          }),
          search_result: new GenreSearchResult({
            items: [genres[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await categoryRepo.bulkInsert(categories);
        await genreRepo.bulkInsert(genres);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result: expected_result }) => {
          const result = await genreRepo.search(search_params);
          const expected = expected_result.toJSON(true);
          expect(result.toJSON(true)).toMatchObject({
            ...expected,
            items: expected.items.map((i) => ({
              ...i,
              categories_ids: expect.arrayContaining(i.categories_ids),
            })),
          });
        },
      );
    });
  });

  describe('transaction mode', () => {
    describe('insert method', () => {
      it('should insert a genre', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genre = GenreFakeBuilder.aGenre()
          .addCategoryId(category.category_id)
          .build();

        await uow.start();
        await genreRepo.insert(genre);
        await uow.commit();

        const result = await genreRepo.findById(genre.genre_id);
        expect(genre.genre_id).toBeValueObject(result!.genre_id);
      });

      it('rollback the insertion', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genre = GenreFakeBuilder.aGenre()
          .addCategoryId(category.category_id)
          .build();

        await uow.start();
        await genreRepo.insert(genre);
        await uow.rollback();

        await expect(genreRepo.findById(genre.genre_id)).resolves.toBeNull();
      });
    });

    describe('bulkInsert method', () => {
      it('should insert a list of genres', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genres = GenreFakeBuilder.theGenres(2)
          .addCategoryId(category.category_id)
          .build();

        await uow.start();
        await genreRepo.bulkInsert(genres);
        await uow.commit();

        const [genre1, genre2] = await Promise.all([
          genreRepo.findById(genres[0].genre_id),
          genreRepo.findById(genres[1].genre_id),
        ]);
        expect(genre1!.genre_id).toBeValueObject(genres[0].genre_id);
        expect(genre2!.genre_id).toBeValueObject(genres[1].genre_id);
      });

      it('rollback the bulk insertion', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genres = GenreFakeBuilder.theGenres(2)
          .addCategoryId(category.category_id)
          .build();

        await uow.start();
        await genreRepo.bulkInsert(genres);
        await uow.rollback();

        await expect(
          genreRepo.findById(genres[0].genre_id),
        ).resolves.toBeNull();
        await expect(
          genreRepo.findById(genres[1].genre_id),
        ).resolves.toBeNull();
      });
    });

    describe('findById method', () => {
      it('should return a genre', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genre = GenreFakeBuilder.aGenre()
          .addCategoryId(category.category_id)
          .build();

        await uow.start();
        await genreRepo.insert(genre);
        const result = await genreRepo.findById(genre.genre_id);
        expect(result!.genre_id).toBeValueObject(genre.genre_id);
        await uow.commit();
      });
    });

    describe('findAll method', () => {
      it('should return a list of genres', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genres = GenreFakeBuilder.theGenres(2)
          .addCategoryId(category.category_id)
          .build();

        await uow.start();
        await genreRepo.bulkInsert(genres);
        const result = await genreRepo.findAll();
        expect(result.length).toBe(2);
        await uow.commit();
      });
    });

    describe('findByIds method', () => {
      it('should return a list of genres', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genres = GenreFakeBuilder.theGenres(2)
          .addCategoryId(category.category_id)
          .build();

        await uow.start();
        await genreRepo.bulkInsert(genres);
        const result = await genreRepo.findByIds(genres.map((g) => g.genre_id));
        expect(result.length).toBe(2);
        await uow.commit();
      });
    });

    describe('existsById method', () => {
      it('should return true if the genre exists', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genre = GenreFakeBuilder.aGenre()
          .addCategoryId(category.category_id)
          .build();

        await uow.start();
        await genreRepo.insert(genre);
        const existsResult = await genreRepo.existsById([genre.genre_id]);
        expect(existsResult.exists[0]).toBeValueObject(genre.genre_id);
        await uow.commit();
      });
    });

    describe('update method', () => {
      it('should update a genre', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genre = GenreFakeBuilder.aGenre()
          .addCategoryId(category.category_id)
          .build();
        await genreRepo.insert(genre);

        await uow.start();
        genre.changeName('new name');
        await genreRepo.update(genre);
        await uow.commit();

        const result = await genreRepo.findById(genre.genre_id);
        expect(result!.name).toBe(genre.name);
      });

      it('rollback the update', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genre = GenreFakeBuilder.aGenre()
          .addCategoryId(category.category_id)
          .build();
        await genreRepo.insert(genre);
        await uow.start();
        genre.changeName('new name');
        await genreRepo.update(genre);
        await uow.rollback();
        const notChangeGenre = await genreRepo.findById(genre.genre_id);
        expect(notChangeGenre!.name).not.toBe(genre.name);
      });
    });

    describe('delete method', () => {
      it('should delete a genre', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genre = GenreFakeBuilder.aGenre()
          .addCategoryId(category.category_id)
          .build();
        await genreRepo.insert(genre);

        await uow.start();
        await genreRepo.delete(genre.genre_id);
        await uow.commit();

        await expect(genreRepo.findById(genre.genre_id)).resolves.toBeNull();
      });

      it('rollback the deletion', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genre = GenreFakeBuilder.aGenre()
          .addCategoryId(category.category_id)
          .build();
        await genreRepo.insert(genre);

        await uow.start();
        await genreRepo.delete(genre.genre_id);
        await uow.rollback();

        const result = await genreRepo.findById(genre.genre_id);
        expect(result!.genre_id).toBeValueObject(genre.genre_id);
      });
    });

    describe('search method', () => {
      it('should return a list of genres', async () => {
        const category = CategoryFakeBuilder.aCategory().build();
        await categoryRepo.insert(category);
        const genres = GenreFakeBuilder.theGenres(2)
          .withName('genre')
          .addCategoryId(category.category_id)
          .build();

        await uow.start();
        await genreRepo.bulkInsert(genres);
        const searchParams = GenreSearchParams.create({
          filter: { name: 'genre' },
        });
        const result = await genreRepo.search(searchParams);
        expect(result.items.length).toBe(2);
        expect(result.total).toBe(2);
        await uow.commit();
      });
    });
  });
});
