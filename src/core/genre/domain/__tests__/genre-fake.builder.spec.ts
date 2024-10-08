import { CategoryId } from '../../../category/domain/category.aggregate';
import { GenreFakeBuilder } from '../genre-fake.builder';
import { Genre, GenreId } from '../genre.aggregate';

describe('Genre Unit Tests', () => {
  beforeEach(() => {
    Genre.prototype.validate = jest
      .fn()
      .mockImplementation(Genre.prototype.validate);
  });
  test('constructor of genre', () => {
    const categoryId = new CategoryId();
    const categoriesId = new Map<string, CategoryId>([
      [categoryId.id, categoryId],
    ]);
    let genre = new Genre({
      name: 'test',
      categories_ids: categoriesId,
    });
    expect(genre.genre_id).toBeInstanceOf(GenreId);
    expect(genre.name).toBe('test');
    expect(genre.categories_ids).toEqual(categoriesId);
    expect(genre.is_active).toBe(true);
    expect(genre.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    genre = new Genre({
      name: 'test',
      categories_ids: categoriesId,
      is_active: false,
      created_at,
    });
    expect(genre.genre_id).toBeInstanceOf(GenreId);
    expect(genre.name).toBe('test');
    expect(genre.categories_ids).toEqual(categoriesId);
    expect(genre.is_active).toBe(false);
    expect(genre.created_at).toBe(created_at);
  });

  describe('genre_id field', () => {
    const categoryId = new CategoryId();
    const categories_ids = new Map<string, CategoryId>([
      [categoryId.id, categoryId],
    ]);
    const arrange = [
      { name: 'Movie', categories_ids },
      { name: 'Movie', categories_ids, id: null },
      { name: 'Movie', categories_ids, id: undefined },
      { name: 'Movie', categories_ids, id: new GenreId() },
    ];

    test.each(arrange)('when props is %j', (item) => {
      const genre = new Genre(item);
      expect(genre.genre_id).toBeInstanceOf(GenreId);
    });
  });

  describe('create command', () => {
    test('should create a genre', () => {
      const categoryId = new CategoryId();
      const categories_ids = new Map<string, CategoryId>([
        [categoryId.id, categoryId],
      ]);
      const genre = Genre.create({
        name: 'test',
        categories_ids: [categoryId],
      });
      expect(genre.genre_id).toBeInstanceOf(GenreId);
      expect(genre.name).toBe('test');
      expect(genre.categories_ids).toEqual(categories_ids);
      expect(genre.created_at).toBeInstanceOf(Date);
      expect(Genre.prototype.validate).toHaveBeenCalledTimes(1);

      const genre2 = Genre.create({
        name: 'test',
        categories_ids: [categoryId],
        is_active: false,
      });
      expect(genre2.genre_id).toBeInstanceOf(GenreId);
      expect(genre2.name).toBe('test');
      expect(genre2.categories_ids).toEqual(categories_ids);
      expect(genre2.is_active).toBe(false);
      expect(genre2.created_at).toBeInstanceOf(Date);
    });
  });

  test('should change name', () => {
    const genre = Genre.create({
      name: 'test',
      categories_ids: [new CategoryId()],
    });
    genre.changeName('test2');
    expect(genre.name).toBe('test2');
    expect(Genre.prototype.validate).toHaveBeenCalledTimes(2);
  });

  test('should add category id', () => {
    const categoryId = new CategoryId();
    const genre = Genre.create({
      name: 'test',
      categories_ids: [categoryId],
    });
    genre.addCategoryId(categoryId);
    expect(genre.categories_ids.size).toBe(1);
    expect(genre.categories_ids).toEqual(
      new Map([[categoryId.id, categoryId]]),
    );
    expect(Genre.prototype.validate).toHaveBeenCalledTimes(1);

    const categoryId2 = new CategoryId();
    genre.addCategoryId(categoryId2);
    expect(genre.categories_ids.size).toBe(2);
    expect(genre.categories_ids).toEqual(
      new Map([
        [categoryId.id, categoryId],
        [categoryId2.id, categoryId2],
      ]),
    );
    expect(Genre.prototype.validate).toHaveBeenCalledTimes(1);
  });
});

describe('Genre Validator', () => {
  describe('create command', () => {
    test('should an invalid genre with name property', () => {
      const categoryId = new CategoryId();
      const genre = Genre.create({
        name: 't'.repeat(256),
        categories_ids: [categoryId],
      } as any);
      expect(genre.notification.hasErrors()).toBe(true);
      expect(genre.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
  describe('changeName method', () => {
    it('should a invalid genre using name property', () => {
      const genre = GenreFakeBuilder.aGenre().build();
      genre.changeName('t'.repeat(256));
      expect(genre.notification.hasErrors()).toBe(true);
      expect(genre.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
