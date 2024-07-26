import { CastMemberFakeBuilder } from './../../../../domain/cast-member-fake.builder';
import { CastMemberSequelizeRepository } from './../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { DeleteCastMemberUseCase } from './../delete-cast-member.use-case';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { CastMember } from '../../../../domain/cast-member.aggregate';

describe('DeleteCastMemberUseCase Integration Tests', () => {
  let useCase: DeleteCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new DeleteCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, CastMember),
    );
  });

  it('should delete a castMember', async () => {
    const castMember = CastMemberFakeBuilder.aCastMember().build();
    await repository.insert(castMember);
    await useCase.execute({
      id: castMember.cast_member_id.id,
    });
    await expect(
      repository.findById(castMember.cast_member_id),
    ).resolves.toBeNull();
  });
});
