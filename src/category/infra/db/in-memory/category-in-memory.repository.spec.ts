import { CategoryFakeBuilder } from "../../../domain/category-fake.builder";
import { CategoryInMemoryRepository } from "./category-in-memory.repository";

describe("CategoryInMemoryRepository", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => (repository = new CategoryInMemoryRepository()));
  it("should no filter items when filter object is null", async () => {
    const items = [CategoryFakeBuilder.aCategory().build()];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items using filter parameter", async () => {
    const items = [
      CategoryFakeBuilder.aCategory().withName("test").build(),
      CategoryFakeBuilder.aCategory().withName("TEST").build(),
      CategoryFakeBuilder.aCategory().withName("fake").build(),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, "TEST");
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it("should sort by created_at when sort param is null", async () => {
    const created_at = new Date();

    const items = CategoryFakeBuilder.theCategories(3).withCreatedAt((index) => new Date(created_at.getTime() + ((index + 1) * 100))).build();

    const itemsSorted = repository["applySort"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by name", async () => {
    const items = [
      CategoryFakeBuilder.aCategory().withName("c").build(),
      CategoryFakeBuilder.aCategory().withName("b").build(),
      CategoryFakeBuilder.aCategory().withName("a").build(),
    ];

    let itemsSorted = repository["applySort"](items, "name", "asc");
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = repository["applySort"](items, "name", "desc");
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});