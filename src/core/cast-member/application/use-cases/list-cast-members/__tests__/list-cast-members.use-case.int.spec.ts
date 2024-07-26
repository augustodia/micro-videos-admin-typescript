import { CastMemberFakeBuilder } from './../../../../domain/cast-member-fake.builder';
import { CastMemberSequelizeRepository } from './../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { ListCastMembersUseCase } from './../list-cast-members.use-case';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { CastMemberOutputMapper } from '../../common/cast-member-output';
import { CastMemberType } from '../../../../domain/cast-member-type';
import { CastMember } from '../../../../domain/cast-member.aggregate';

describe('ListCastMembersUseCase Integration Tests', () => {
  let useCase: ListCastMembersUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new ListCastMembersUseCase(repository);
  });

  it('should return output sorted by created_at when input param is empty', async () => {
    const castMembers = CastMemberFakeBuilder.theCastMembers(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build();

    await repository.bulkInsert(castMembers);
    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [...castMembers].reverse().map(CastMemberOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should returns output using pagination, sort and filter', async () => {
    const castMembers = [
      new CastMember({ name: 'aaa', type: CastMemberType.ACTOR }),
      new CastMember({
        name: 'AAA',
        type: CastMemberType.ACTOR,
      }),
      new CastMember({
        name: 'AaA',
        type: CastMemberType.ACTOR,
      }),
      new CastMember({
        name: 'b',
        type: CastMemberType.ACTOR,
      }),
      new CastMember({
        name: 'c',
        type: CastMemberType.ACTOR,
      }),
    ];
    await repository.bulkInsert(castMembers);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      name: 'a',
    });
    expect(output).toEqual({
      items: [castMembers[1], castMembers[2]].map(
        CastMemberOutputMapper.toOutput,
      ),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'name',
      name: 'a',
    });
    expect(output).toEqual({
      items: [castMembers[0]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      name: 'a',
    });
    expect(output).toEqual({
      items: [castMembers[0], castMembers[2]].map(
        CastMemberOutputMapper.toOutput,
      ),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
