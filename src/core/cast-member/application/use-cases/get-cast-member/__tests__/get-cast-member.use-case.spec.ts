import { GetCastMemberUseCase } from './../get-cast-member.use-case';
import { CastMemberInMemoryRepository } from './../../../../infra/db/in-memory/cast-member-in-memory.repository';

import { CastMember } from './../../../../domain/cast-member.entity';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '../../../../../shared/domain/value-objects/uuid.vo';
import { CastMemberType } from '../../../../domain/cast-member-type';

describe('GetCastMemberUseCase Unit Tests', () => {
  let useCase: GetCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new GetCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError('fake id'),
    );

    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, CastMember),
    );
  });

  it('should returns a cast-member', async () => {
    const items = [
      CastMember.create({ name: 'Actor', type: CastMemberType.ACTOR }),
    ];
    repository.items = items;
    const spyFindById = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: items[0].cast_member_id.id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].cast_member_id.id,
      name: 'Actor',
      type: CastMemberType.ACTOR,
      created_at: items[0].created_at,
    });
  });
});
