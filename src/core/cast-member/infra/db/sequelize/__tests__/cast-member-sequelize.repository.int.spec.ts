import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberFakeBuilder } from '../../../../domain/cast-member-fake.builder';
import { CastMemberType } from '../../../../domain/cast-member-type';
import { CastMember } from '../../../../domain/cast-member.entity';
import {
  CastMemberSearchParams,
  CastMemberSearchResult,
} from '../../../../domain/cast-member.repository';
import { CastMemberModelMapper } from '../cast-member-model-mapper';
import { CastMemberSequelizeRepository } from '../cast-member-sequelize.repository';
import { CastMemberModel } from '../cast-member.model';

describe('CastMemberSequelizeRepository Integration Test', () => {
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(async () => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  it('should inserts a new entity', async () => {
    const castMember = CastMemberFakeBuilder.aCastMember().build();
    await repository.insert(castMember);
    const entity = await repository.findById(castMember.cast_member_id);
    expect(entity?.toJSON()).toStrictEqual(castMember.toJSON());
  });

  it('should finds a entity by id', async () => {
    let entityFound = await repository.findById(new Uuid());
    expect(entityFound).toBeNull();

    const entity = CastMemberFakeBuilder.aCastMember().build();
    await repository.insert(entity);
    entityFound = await repository.findById(entity.cast_member_id);
    expect(entity.toJSON()).toStrictEqual(entityFound?.toJSON());
  });

  it('should return all categories', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build();
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  it('should throw error on update when a entity not found', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.cast_member_id.id, CastMember),
    );
  });

  it('should update a entity', async () => {
    const entity = CastMemberFakeBuilder.aCastMember().build();
    await repository.insert(entity);

    entity.changeName('Actor updated');
    await repository.update(entity);

    const entityFound = await repository.findById(entity.cast_member_id);
    expect(entity.toJSON()).toStrictEqual(entityFound?.toJSON());
  });

  it('should throw error on delete when a entity not found', async () => {
    const castMemberId = new Uuid();
    await expect(repository.delete(castMemberId)).rejects.toThrow(
      new NotFoundError(castMemberId.id, CastMember),
    );
  });

  it('should delete a entity', async () => {
    const entity = new CastMember({
      name: 'Actor',
      type: CastMemberType.ACTOR,
    });
    await repository.insert(entity);

    await repository.delete(entity.cast_member_id);
    await expect(
      repository.findById(entity.cast_member_id),
    ).resolves.toBeNull();
  });

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const created_at = new Date();
      const categories = CastMemberFakeBuilder.theCastMembers(16)
        .withName('Actor')
        .withType(CastMemberType.ACTOR)
        .withCreatedAt(created_at)
        .build();
      await repository.bulkInsert(categories);
      const spyToEntity = jest.spyOn(CastMemberModelMapper, 'toEntity');

      const searchOutput = await repository.search(
        new CastMemberSearchParams(),
      );
      expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(CastMember);
        expect(item.cast_member_id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Actor',
          type: CastMemberType.ACTOR,
          created_at: created_at,
        }),
      );
    });

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date();
      const categories = CastMemberFakeBuilder.theCastMembers(16)
        .withName((index) => `Actor ${index}`)
        .withType(CastMemberType.ACTOR)
        .withCreatedAt((index) => new Date(created_at.getTime() + index))
        .build();
      const searchOutput = await repository.search(
        new CastMemberSearchParams(),
      );
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(`Actor ${index}`).toBe(`${categories[index + 1].name}`);
      });
    });

    it('should apply paginate and filter', async () => {
      const categories = [
        CastMemberFakeBuilder.aCastMember()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        CastMemberFakeBuilder.aCastMember()
          .withName('aaa')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        CastMemberFakeBuilder.aCastMember()
          .withName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        CastMemberFakeBuilder.aCastMember()
          .withName('TeSt')
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(categories);

      let searchOutput = await repository.search(
        new CastMemberSearchParams({
          page: 1,
          per_page: 2,
          filter: {
            name: 'TEST',
          },
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      );

      searchOutput = await repository.search(
        new CastMemberSearchParams({
          page: 2,
          per_page: 2,
          filter: {
            name: 'TEST',
          },
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [categories[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }).toJSON(true),
      );
    });

    it('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['name', 'created_at']);

      const categories = [
        CastMemberFakeBuilder.aCastMember().withName('bbb').build(),
        CastMemberFakeBuilder.aCastMember().withName('aaa').build(),
        CastMemberFakeBuilder.aCastMember().withName('ddd').build(),
        CastMemberFakeBuilder.aCastMember().withName('eee').build(),
        CastMemberFakeBuilder.aCastMember().withName('ccc').build(),
      ];
      await repository.bulkInsert(categories);

      const arrange = [
        {
          params: new CastMemberSearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
          }),
          result: new CastMemberSearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new CastMemberSearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
          }),
          result: new CastMemberSearchResult({
            items: [categories[4], categories[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          params: new CastMemberSearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new CastMemberSearchResult({
            items: [categories[3], categories[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new CastMemberSearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new CastMemberSearchResult({
            items: [categories[4], categories[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });

    describe('should search using filter, sort and paginate', () => {
      const categories = [
        CastMemberFakeBuilder.aCastMember().withName('test').build(),
        CastMemberFakeBuilder.aCastMember().withName('aaa').build(),
        CastMemberFakeBuilder.aCastMember().withName('TEST').build(),
        CastMemberFakeBuilder.aCastMember().withName('eaa').build(),
        CastMemberFakeBuilder.aCastMember().withName('TeSt').build(),
      ];

      const arrange = [
        {
          search_params: new CastMemberSearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: {
              name: 'TEST',
            },
          }),
          search_result: new CastMemberSearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new CastMemberSearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: {
              name: 'TEST',
            },
          }),
          search_result: new CastMemberSearchResult({
            items: [categories[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(categories);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        },
      );
    });

    describe('should search by type using filter, sort and paginate', () => {
      const categories = [
        CastMemberFakeBuilder.aCastMember()
          .withType(CastMemberType.ACTOR)
          .build(),
        CastMemberFakeBuilder.aCastMember()
          .withType(CastMemberType.DIRECTOR)
          .build(),
        CastMemberFakeBuilder.aCastMember()
          .withType(CastMemberType.ACTOR)
          .build(),
        CastMemberFakeBuilder.aCastMember()
          .withType(CastMemberType.DIRECTOR)
          .build(),
        CastMemberFakeBuilder.aCastMember()
          .withType(CastMemberType.ACTOR)
          .build(),
      ];

      const arrange = [
        {
          search_params: new CastMemberSearchParams({
            page: 1,
            per_page: 2,
            sort: 'created_at',
            filter: {
              type: CastMemberType.ACTOR,
            },
          }),
          search_result: new CastMemberSearchResult({
            items: [categories[0], categories[2]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new CastMemberSearchParams({
            page: 2,
            per_page: 2,
            sort: 'created_at',
            filter: {
              type: CastMemberType.ACTOR,
            },
          }),
          search_result: new CastMemberSearchResult({
            items: [categories[4]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(categories);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);

          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        },
      );
    });
  });
});
