import { TestingModule, Test } from '@nestjs/testing';

import { ConfigModule } from '../../config/config.module';
import { CastMembersController } from '../cast-members.controller';
import { ICastMemberRepository } from '../../../core/cast-member/domain/cast-member.repository';
import { DatabaseModule } from '../../database/database.module';
import { CastMembersModule } from '../cast-members.module';
import { CAST_MEMBER_PROVIDERS } from '../cast-members.providers';
import { CreateCastMemberUseCase } from '../../../core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { UpdateCastMemberUseCase } from '../../../core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case';
import { ListCastMembersUseCase } from '../../../core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case';
import { GetCastMemberUseCase } from '../../../core/cast-member/application/use-cases/get-cast-member/get-cast-member.use-case';
import { DeleteCastMemberUseCase } from '../../../core/cast-member/application/use-cases/delete-cast-member/delete-cast-member.use-case';
import {
  CreateCastMemberFixture,
  ListCastMembersFixture,
  UpdateCastMemberFixture,
} from '../testing/fixture/cast-member.fixture';
import { CastMemberOutputMapper } from '../../../core/cast-member/application/use-cases/common/cast-member-output';
import { Uuid } from '../../../core/shared/domain/value-objects/uuid.vo';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from '../cast-members.presenter';
import { CastMemberFakeBuilder } from '../../../core/cast-member/domain/cast-member-fake.builder';

describe('CastMembersController Integration Tests', () => {
  let controller: CastMembersController;
  let repository: ICastMemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CastMembersModule],
    }).compile();
    controller = module.get<CastMembersController>(CastMembersController);
    repository = module.get<ICastMemberRepository>(
      CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(CreateCastMemberUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateCastMemberUseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListCastMembersUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetCastMemberUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteCastMemberUseCase);
  });

  describe('should create a category', () => {
    const arrange = CreateCastMemberFixture.arrangeForCreate();
    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data);
        const entity = await repository.findById(new Uuid(presenter.id));
        expect(entity.toJSON()).toStrictEqual({
          cast_member_id: presenter.id,
          created_at: presenter.created_at,
          ...expected,
        });
        const output = CastMemberOutputMapper.toOutput(entity);
        expect(presenter).toEqual(new CastMemberPresenter(output));
      },
    );
  });

  describe('should update a category', () => {
    const arrange = UpdateCastMemberFixture.arrangeForUpdate();

    const category = CastMemberFakeBuilder.aCastMember().build();

    beforeEach(async () => {
      await repository.insert(category);
    });

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.update(
          category.cast_member_id.id,
          send_data,
        );
        const entity = await repository.findById(new Uuid(presenter.id));
        expect(entity.toJSON()).toStrictEqual({
          cast_member_id: presenter.id,
          created_at: presenter.created_at,
          name: expected.name ?? category.name,
          type: 'type' in expected ? expected.type : category.type,
        });
        const output = CastMemberOutputMapper.toOutput(entity);
        expect(presenter).toEqual(new CastMemberPresenter(output));
      },
    );
  });

  it('should delete a category', async () => {
    const category = CastMemberFakeBuilder.aCastMember().build();
    await repository.insert(category);
    const response = await controller.remove(category.cast_member_id.id);
    expect(response).not.toBeDefined();
    await expect(
      repository.findById(category.cast_member_id),
    ).resolves.toBeNull();
  });

  it('should get a category', async () => {
    const category = CastMemberFakeBuilder.aCastMember().build();
    await repository.insert(category);
    const presenter = await controller.findOne(category.cast_member_id.id);

    expect(presenter.id).toBe(category.cast_member_id.id);
    expect(presenter.name).toBe(category.name);
    expect(presenter.type).toBe(category.type);
    expect(presenter.created_at).toStrictEqual(category.created_at);
  });

  describe('search method', () => {
    describe('should sorted cast-members by created_at', () => {
      const { entitiesMap, arrange } =
        ListCastMembersFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new CastMemberCollectionPresenter({
              items: entities.map(CastMemberOutputMapper.toOutput),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });

    describe('should return cast-members using pagination, sort and filter', () => {
      const { entitiesMap, arrange } = ListCastMembersFixture.arrangeUnsorted();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(
            send_data,
            send_data.filter,
          );
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new CastMemberCollectionPresenter({
              items: entities.map(CastMemberOutputMapper.toOutput),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });
  });
});
