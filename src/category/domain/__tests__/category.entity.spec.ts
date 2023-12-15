import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity"

describe('Category Unit Tests', () => {
  describe('constructor', () => {
    
    let category = new Category({
      name: 'Movie',
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);

    const created_at = new Date();

    category = new Category({
      name: 'Movie',
      description: 'Movie description',
      is_active: false,
      created_at,
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('Movie description');
    expect(category.is_active).toBeFalsy();
    expect(category.created_at).toBe(created_at);

    category = new Category({
      name: 'Movie',
      description: 'Movie description',
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('Movie description');
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);
  })
})

describe('create command', () => {
  test('should create a category', () => {
    const category = Category.create({
      name: 'Movie',
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);
  })

  test('should create a category with description', () => {
    const category = Category.create({
      name: 'Movie',
      description: 'Movie description',
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('Movie description');
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);
  })

  test('should create a category with is_active false', () => {
    const category = Category.create({
      name: 'Movie',
      is_active: false,
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();
    expect(category.is_active).toBe(false);
    expect(category.created_at).toBeInstanceOf(Date);
  })

  test('should create a category with description and is_active false', () => {
    const category = Category.create({
      name: 'Movie',
      description: 'Movie description',
      is_active: false,
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('Movie description');
    expect(category.is_active).toBe(false);
    expect(category.created_at).toBeInstanceOf(Date);
  })

  describe('category id', () => {
    const arrange = [{category_id: null}, {category_id: undefined}, {category_id: new Uuid()},]

    test.each(arrange)('should create a category with category_id %p', ({category_id}) => {
      const category = new Category({
        category_id: category_id,
        name: 'Movie',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
    });
  })

  test('should change name', () => {
    const category = Category.create({
      name: 'Movie',
    });

    category.changeName('Movie 2');

    expect(category.name).toBe('Movie 2');
  })

  test('should change description', () => {
    const category = Category.create({
      name: 'Movie',
    });

    category.changeDescription('Movie description');

    expect(category.description).toBe('Movie description');
  })

  test('should activate', () => {
    const category = Category.create({
      name: 'Movie',
      is_active: false,
    });

    category.activate();

    expect(category.is_active).toBe(true);
  })

  test('should deactivate', () => {
    const category = Category.create({
      name: 'Movie',
      is_active: true,
    });

    category.deactivate();

    expect(category.is_active).toBe(false);
  })
})