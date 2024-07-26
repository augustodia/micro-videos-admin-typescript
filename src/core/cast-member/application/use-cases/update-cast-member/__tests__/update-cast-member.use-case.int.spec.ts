import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberFakeBuilder } from '../../../../domain/cast-member-fake.builder';
import { CastMemberType } from '../../../../domain/cast-member-type';
import { CastMember } from '../../../../domain/cast-member.aggregate';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';

describe('UpdateCastMemberUseCase Integration Tests', () => {
  let useCase: UpdateCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new UpdateCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(uuid.id, CastMember));
  });

  it('should update a cast-member', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build();
    repository.insert(entity);

    let output = await useCase.execute({
      id: entity.cast_member_id.id,
      name: 'test',
    });
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'test',
      type: entity.type,
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
          name: 'test1',
          type: CastMemberType.DIRECTOR,
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test1',
          type: CastMemberType.DIRECTOR,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test2',
          type: CastMemberType.ACTOR,
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test2',
          type: CastMemberType.ACTOR,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test3',
          type: CastMemberType.DIRECTOR,
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test3',
          type: CastMemberType.DIRECTOR,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test4',
          type: CastMemberType.ACTOR,
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test4',
          type: CastMemberType.ACTOR,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test5',
          type: CastMemberType.DIRECTOR,
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test5',
          type: CastMemberType.DIRECTOR,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test6',
          type: null as any,
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test6',
          type: CastMemberType.DIRECTOR,
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...(i.input.name && { name: i.input.name }),
        ...('type' in i.input && { type: i.input.type }),
      });
      const entityUpdated = await repository.findById(new Uuid(i.input.id));

      expect(output).toStrictEqual({
        id: entity.cast_member_id.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: entityUpdated?.created_at,
      });
      expect(entityUpdated?.toJSON()).toStrictEqual({
        cast_member_id: entity.cast_member_id.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: entityUpdated?.created_at,
      });
    }
  });
});
