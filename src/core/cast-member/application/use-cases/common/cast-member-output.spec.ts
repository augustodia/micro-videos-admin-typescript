import { CastMemberType } from '../../../domain/cast-member-type';
import { CastMember } from '../../../domain/cast-member.entity';
import { CastMemberOutputMapper } from './cast-member-output';

describe('CastMemberOutputMapper Unit Tests', () => {
  it('should convert a category in output', () => {
    const entity = CastMember.create({
      name: 'Actor',
      type: CastMemberType.ACTOR,
    });
    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = CastMemberOutputMapper.toOutput(entity);
    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'Actor',
      type: CastMemberType.ACTOR,
      created_at: entity.created_at,
    });
  });
});
