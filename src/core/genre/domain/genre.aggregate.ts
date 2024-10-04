import { CategoryId } from '../../category/domain/category.aggregate';
import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import GenreValidatorFactory from './genre.validator';

export type GenreConstructorProps = {
  genre_id?: GenreId;
  name: string;
  categories_ids: Map<string, CategoryId>;
  is_active?: boolean;
  created_at?: Date;
};

export type GenreCreateProps = {
  name: string;
  categories_ids: CategoryId[];
  is_active?: boolean;
};

export class GenreId extends Uuid {}

export class Genre extends AggregateRoot {
  genre_id: GenreId;
  name: string;
  categories_ids: Map<string, CategoryId>;
  is_active: boolean;
  created_at: Date;

  constructor(props: GenreConstructorProps) {
    super();
    this.genre_id = props.genre_id ?? new GenreId();
    this.name = props.name;
    this.categories_ids = props.categories_ids;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: GenreCreateProps): Genre {
    const genre = new Genre({
      ...props,
      categories_ids: new Map(
        props.categories_ids.map((category_id) => [
          category_id.id,
          category_id,
        ]),
      ),
    });

    genre.validate();

    return genre;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  addCategoryId(category_id: CategoryId): void {
    this.categories_ids.set(category_id.id, category_id);
  }

  removeCategoryId(category_id: CategoryId): void {
    this.categories_ids.delete(category_id.id);
  }

  syncCategoriesIds(categories_ids: CategoryId[]): void {
    if (categories_ids.length === 0) {
      throw new Error('Categories cannot be empty');
    }

    this.categories_ids = new Map(
      categories_ids.map((category_id) => [category_id.id, category_id]),
    );
  }

  activate(): void {
    this.is_active = true;
  }

  deactivate(): void {
    this.is_active = false;
  }

  get entity_id(): GenreId {
    return this.genre_id;
  }

  validate(fields?: string[]) {
    const validator = GenreValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  toJSON() {
    return {
      genre_id: this.genre_id.id,
      name: this.name,
      categories_ids: Array.from(this.categories_ids.values()).map(
        (category_id) => category_id.id,
      ),
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
