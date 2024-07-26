import { IsEnum, MaxLength, MinLength } from 'class-validator';
import { CastMemberType } from './cast-member-type';
import { CastMember } from './cast-member.aggregate';
import { Notification } from '../../shared/domain/validators/notification';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-field';

export class CastMemberRules {
  @MinLength(3, { groups: ['name'] })
  @MaxLength(255, { groups: ['name'] })
  name: string;

  @IsEnum(CastMemberType, { groups: ['type'] })
  type: CastMemberType;

  constructor(entity: CastMember) {
    Object.assign(this, entity);
  }
}

export class CastMemberValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ['name', 'type'];
    return super.validate(notification, new CastMemberRules(data), newFields);
  }
}

export class CastMemberValidatorFactory {
  static create() {
    return new CastMemberValidator();
  }
}
