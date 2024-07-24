import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '../../../../../shared/domain/value-objects/uuid.vo';
import { CastMemberType } from '../../../../domain/cast-member-type';
import { CastMember } from '../../../../domain/cast-member.entity';
import { CastMemberInMemoryRepository } from '../../../../infra/db/in-memory/cast-member-in-memory.repository';
import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';

describe('UpdateCastMemberUseCase Unit Tests', () => {
  let useCase: UpdateCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new UpdateCastMemberUseCase(repository);
  });

  it('should throw an error when aggregate is not valid', async () => {
    const aggregate = new CastMember({
      name: 'Director',
      type: CastMemberType.DIRECTOR,
    });
    repository.items = [aggregate];
    await expect(() =>
      useCase.execute({
        id: aggregate.cast_member_id.id,
        name: 't'.repeat(256),
      }),
    ).rejects.toThrow('Entity Validation Error');
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'fake id', name: 'fake' }),
    ).rejects.toThrow(new InvalidUuidError('fake id'));

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(uuid.id, CastMember));
  });

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new CastMember({
      name: 'Actor',
      type: CastMemberType.ACTOR,
    });
    repository.items = [entity];

    let output = await useCase.execute({
      id: entity.cast_member_id.id,
      name: 'test',
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'test',
      type: CastMemberType.ACTOR,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        type?: CastMemberType;
      };
      expected: {
        id: string;
        name: string;
        type: CastMemberType;
        created_at: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: CastMemberType.DIRECTOR,
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: CastMemberType.DIRECTOR,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test',
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: CastMemberType.DIRECTOR,

          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test',
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: CastMemberType.DIRECTOR,

          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test',
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: CastMemberType.DIRECTOR,

          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test',
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: CastMemberType.DIRECTOR,

          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: CastMemberType.DIRECTOR,
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: CastMemberType.DIRECTOR,

          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...('name' in i.input && { name: i.input.name }),
        ...('type' in i.input && { type: i.input.type }),
      });

      expect(output).toStrictEqual({
        id: entity.cast_member_id.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: i.expected.created_at,
      });
    }
  });
});
