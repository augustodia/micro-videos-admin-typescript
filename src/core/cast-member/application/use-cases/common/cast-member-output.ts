import { CastMemberType } from '../../../domain/cast-member-type';
import { CastMember } from '../../../domain/cast-member.entity';

export type CastMemberOutput = {
  id: string;
  name: string;
  type: CastMemberType;
  is_active: boolean;
  created_at: Date;
};

export class CastMemberOutputMapper {
  static toOutput(entity: CastMember): CastMemberOutput {
    const { cast_member_id, ...otherProps } = entity.toJSON();
    return {
      id: cast_member_id,
      ...otherProps,
    };
  }
}
