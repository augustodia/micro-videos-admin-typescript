import { CastMemberInMemoryRepository } from './../../../../infra/db/in-memory/cast-member-in-memory.repository';
import { DeleteCastMemberUseCase } from './../delete-cast-member.use-case';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '../../../../../shared/domain/value-objects/uuid.vo';
import { CastMember } from '../../../../domain/cast-member.aggregate';
import { CastMemberType } from '../../../../domain/cast-member-type';

describe('DeleteCastMemberUseCase Unit Tests', () => {
  let useCase: DeleteCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new DeleteCastMemberUseCase(repository);
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

  it('should delete a category', async () => {
    const items = [
      new CastMember({ name: 'test 1', type: CastMemberType.ACTOR }),
    ];
    repository.items = items;
    await useCase.execute({
      id: items[0].cast_member_id.id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
