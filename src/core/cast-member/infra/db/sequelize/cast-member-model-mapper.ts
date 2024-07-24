import { CastMemberType } from '../../../domain/cast-member-type';
import { EntityValidationError } from '../../../../shared/domain/errors/validation.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { CastMember } from '../../../domain/cast-member.entity';
import { CastMemberModel } from './cast-member.model';

export class CastMemberModelMapper {
  static toModel(entity: CastMember): CastMemberModel {
    return CastMemberModel.build({
      cast_member_id: entity.cast_member_id.id,
      name: entity.name,
      type: entity.type,
      created_at: entity.created_at,
    });
  }

  static toEntity(model: CastMemberModel): CastMember {
    const category = new CastMember({
      cast_member_id: new Uuid(model.cast_member_id),
      name: model.name,
      type: CastMemberModelMapper.resolveType(model.type),
      created_at: model.created_at,
    });

    category.validate();
    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }
    return category;
  }

  private static resolveType(type: string): CastMemberType {
    switch (type) {
      case 'director':
        return CastMemberType.DIRECTOR;
      default:
      case 'actor':
        return CastMemberType.ACTOR;
    }
  }
}
