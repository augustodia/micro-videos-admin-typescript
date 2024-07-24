import { Entity } from '../../shared/domain/entity';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { CastMemberType } from './cast-member-type';
import { CastMemberValidatorFactory } from './cast-member.validator';

export type CastMemberProps = {
  cast_member_id?: Uuid | null;
  name: string;
  type: CastMemberType;
  created_at?: Date;
};

export type CastMemberPropsUpdate = {
  name?: string;
  type?: CastMemberType;
};

export type CastMemberCreateProps = {
  name: string;
  type: CastMemberType;
};

export class CastMember extends Entity {
  cast_member_id: Uuid;
  name: string;
  type: CastMemberType;
  created_at: Date;

  constructor(props: CastMemberProps) {
    super();

    this.cast_member_id = props.cast_member_id ?? new Uuid();
    this.name = props.name;
    this.type = props.type;
    this.created_at = props.created_at ?? new Date();
  }

  get entity_id(): Uuid {
    return this.cast_member_id;
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

  public update(props: CastMemberPropsUpdate): void {
    props.name && this.changeName(props.name);

    if ('type' in props && !!props.type) {
      this.changeType(props.type);
    }
  }

  validate(fields?: [keyof CastMember]): boolean {
    const validator = CastMemberValidatorFactory.create();

    return validator.validate(this.notification, this, fields);
  }

  public toJSON() {
    return {
      cast_member_id: this.cast_member_id.id,
      name: this.name,
      type: this.type,
      created_at: this.created_at,
    };
  }
}
