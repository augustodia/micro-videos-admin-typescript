import { CastMemberType } from '../../../../domain/cast-member-type';
import { CastMemberInMemoryRepository } from '../../../../infra/db/in-memory/cast-member-in-memory.repository';
import { CreateCastMemberUseCase } from '../create-cast-member.use-case';

describe('CreateCastMemberUseCase Unit Tests', () => {
  let useCase: CreateCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new CreateCastMemberUseCase(repository);
  });

  it('should throw an error when aggregate is not valid', async () => {
    const input = { name: 't'.repeat(256), type: CastMemberType.ACTOR };
    await expect(() => useCase.execute(input)).rejects.toThrow(
      'Entity Validation Error',
    );
  });

  it('should create a cast-member', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    let output = await useCase.execute({
      name: 'test',
      type: CastMemberType.ACTOR,
    });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].cast_member_id.id,
      name: 'test',
      type: CastMemberType.ACTOR,
      created_at: repository.items[0].created_at,
    });

    output = await useCase.execute({
      name: 'test',
      type: CastMemberType.DIRECTOR,
    });
    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: repository.items[1].cast_member_id.id,
      name: 'test',
      type: CastMemberType.DIRECTOR,
      created_at: repository.items[1].created_at,
    });
  });
});
