import { CastMemberFakeBuilder } from './../../../domain/cast-member-fake.builder';
import { CastMemberInMemoryRepository } from './cast-member-in-memory.repository';

describe('CastMembersInMemoryRepository', () => {
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => (repository = new CastMemberInMemoryRepository()));
  it('should no filter items when filter object is null', async () => {
    const items = [CastMemberFakeBuilder.aCastMember().build()];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it('should filter items using filter parameter', async () => {
    const items = [
      CastMemberFakeBuilder.aCastMember().withName('test').build(),
      CastMemberFakeBuilder.aCastMember().withName('TEST').build(),
      CastMemberFakeBuilder.aCastMember().withName('fake').build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, {
      name: 'test',
    });
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it('should sort by created_at when sort param is null', async () => {
    const created_at = new Date();

    const items = CastMemberFakeBuilder.theCastMembers(3)
      .withCreatedAt(
        (index) => new Date(created_at.getTime() + (index + 1) * 100),
      )
      .build();

    const itemsSorted = repository['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name', async () => {
    const items = [
      CastMemberFakeBuilder.aCastMember().withName('c').build(),
      CastMemberFakeBuilder.aCastMember().withName('b').build(),
      CastMemberFakeBuilder.aCastMember().withName('a').build(),
    ];

    let itemsSorted = repository['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = repository['applySort'](items, 'name', 'desc');
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
