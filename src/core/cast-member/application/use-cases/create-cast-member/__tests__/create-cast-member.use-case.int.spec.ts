import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberType } from '../../../../domain/cast-member-type';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { CreateCastMemberUseCase } from '../create-cast-member.use-case';

describe('CreateCastMemberUseCase Integration Tests', () => {
  let useCase: CreateCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new CreateCastMemberUseCase(repository);
  });

  it('should create a cast-member', async () => {
    let output = await useCase.execute({
      name: 'Actor',
      type: CastMemberType.ACTOR,
    });
    let entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity?.cast_member_id.id,
      name: 'Actor',
      type: CastMemberType.ACTOR,
      is_active: true,
      created_at: entity?.created_at,
    });

    output = await useCase.execute({
      name: 'Director',
      type: CastMemberType.DIRECTOR,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity?.cast_member_id.id,
      name: 'Director',
      type: CastMemberType.DIRECTOR,
      is_active: true,
      created_at: entity?.created_at,
    });

    output = await useCase.execute({
      name: 'Actor 1',
      type: CastMemberType.ACTOR,
      is_active: true,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity?.cast_member_id.id,
      name: 'Actor 1',
      type: CastMemberType.ACTOR,
      is_active: true,
      created_at: entity?.created_at,
    });

    output = await useCase.execute({
      name: 'Director 1',
      type: CastMemberType.DIRECTOR,
      is_active: false,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity?.cast_member_id.id,
      name: 'Director 1',
      type: CastMemberType.DIRECTOR,
      is_active: false,
      created_at: entity?.created_at,
    });
  });
});
