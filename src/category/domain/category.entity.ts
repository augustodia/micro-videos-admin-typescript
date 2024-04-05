
import { Entity } from "../../shared/domain/entity";
import { EntityValidationError } from "../../shared/domain/errors/validation.error";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { CategoryValidatorFactory } from "./category.validator";

export type CategoryProps = {
  category_id?: Uuid | null;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
}

export type CategoryPropsUpdate = {
  name?: string;
  description?: string | null;
}

export type CategoryCreateProps = {
  name: string;
  description?: string | null;
  is_active?: boolean;
}

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
    const category =  new Category(props);
    Category.validate(category);

    return category;
  }

  public changeName(name: string): void {
    this.name = name;
    Category.validate(this);
  }

  public changeDescription(description: string | null): void {
    this.description = description;
    Category.validate(this);
  }

  public activate(): void {
    this.is_active = true;
  }

  public deactivate(): void {
    this.is_active = false;
  }

  public update(props: CategoryPropsUpdate): void {
    const hasNameUpdate = Object.keys(props).includes('name');
    
    if(hasNameUpdate) this.name = props.name ?? '';
    this.description = props.description ?? null;

    Category.validate(this);
  }

  static validate(entity: Category) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(entity);

    if (!isValid) throw new EntityValidationError(validator.errors);
  }

  public toJSON() {
    return {
      category_id: this.category_id.id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at
    }
  }
}