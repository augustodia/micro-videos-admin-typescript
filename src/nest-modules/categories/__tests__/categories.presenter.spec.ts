import { instanceToPlain } from 'class-transformer';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../categories.presenter';

describe('CategoriesPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const createdAt = new Date();
      const presenter = new CategoryPresenter({
        id: '1',
        name: 'name',
        description: 'description',
        is_active: true,
        created_at: createdAt,
      });

      expect(instanceToPlain(presenter)).toStrictEqual({
        id: '1',
        name: 'name',
        description: 'description',
        created_at: createdAt.toISOString(),
      });
    });
  });
});

describe('CategoryCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    const createdAt = new Date();
    const presenter = new CategoryCollectionPresenter({
      current_page: 1,
      items: [
        {
          id: '1',
          name: 'name',
          description: 'description',
          is_active: true,
          created_at: createdAt,
        },
      ],
      last_page: 1,
      per_page: 10,
      total: 1,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      data: [
        {
          id: '1',
          name: 'name',
          description: 'description',
          created_at: createdAt.toISOString(),
        },
      ],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 1,
      },
    });
  });
});
