import { Entity } from '../../shared/domain/entity';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { CategoryValidatorFactory } from './category.validator';

export type CategoryProps = {
  category_id?: Uuid | null;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
};

export type CategoryPropsUpdate = {
  name?: string;
  description?: string | null;
  is_active?: boolean;
};

export type CategoryCreateProps = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export class Category extends Entity {
  category_id: Uuid;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;

  constructor(props: CategoryProps) {
    super();

    this.category_id = props.category_id ?? new Uuid();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  get entity_id(): Uuid {
    return this.category_id;
  }

  static create(props: CategoryCreateProps): Category {
    const category = new Category(props);
    category.validate();

    return category;
  }

  public changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  public changeDescription(description: string | null): void {
    this.description = description;
  }

  public activate(): void {
    this.is_active = true;
  }

  public deactivate(): void {
    this.is_active = false;
  }

  public update(props: CategoryPropsUpdate): void {
    props.name && this.changeName(props.name);

    if ('description' in props && props.description !== undefined) {
      this.changeDescription(props.description);
    }

    if (props.is_active === true) {
      this.activate();
    }

    if (props.is_active === false) {
      this.deactivate();
    }
  }

  validate(fields?: [keyof Category]): boolean {
    const validator = CategoryValidatorFactory.create();

    return validator.validate(this.notification, this, fields);
  }

  public toJSON() {
    return {
      category_id: this.category_id.id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
