import { Entity } from '../../shared/domain/entity';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { CastMemberType } from './cast-member-type';
import { CastMemberValidatorFactory } from './cast-member.validator';

export type CastMemberProps = {
  category_id?: Uuid | null;
  name: string;
  type: CastMemberType;
  is_active?: boolean;
  created_at?: Date;
};

export type CastMemberPropsUpdate = {
  name?: string;
  type?: CastMemberType;
  is_active?: boolean;
};

export type CastMemberCreateProps = {
  name: string;
  type: CastMemberType;
  is_active?: boolean;
};

export class CastMember extends Entity {
  category_id: Uuid;
  name: string;
  type: CastMemberType;
  is_active: boolean;
  created_at: Date;

  constructor(props: CastMemberProps) {
    super();

    this.category_id = props.category_id ?? new Uuid();
    this.name = props.name;
    this.type = props.type;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  get entity_id(): Uuid {
    return this.category_id;
  }

  static create(props: CastMemberCreateProps): CastMember {
    const category = new CastMember(props);
    category.validate();

    return category;
  }

  public changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  public changeType(type: CastMemberType): void {
    this.type = type;
    this.validate(['type']);
  }

  public activate(): void {
    this.is_active = true;
  }

  public deactivate(): void {
    this.is_active = false;
  }

  public update(props: CastMemberPropsUpdate): void {
    props.name && this.changeName(props.name);

    if ('type' in props && props.type !== undefined) {
      this.changeType(props.type);
    }

    if (props.is_active === true) {
      this.activate();
    }

    if (props.is_active === false) {
      this.deactivate();
    }
  }

  validate(fields?: [keyof CastMember]): boolean {
    const validator = CastMemberValidatorFactory.create();

    return validator.validate(this.notification, this, fields);
  }

  public toJSON() {
    return {
      category_id: this.category_id.id,
      name: this.name,
      type: this.type,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
