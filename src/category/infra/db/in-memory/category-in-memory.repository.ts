import { SearchParams, SortDirection } from "../../../../shared/domain/repository/search-params";
import { SearchResult } from "../../../../shared/domain/repository/search-result";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository";
import { Category } from "../../../domain/category.entity";

export class CategoryInMemoryRepository extends InMemorySearchableRepository<
  Category,
  Uuid,
  string
> {

  sortableFields: (keyof Category)[] = ["name", "created_at"];

  search(
    props: SearchParams<Category, string>
  ): Promise<SearchResult<Category>> {
    throw new Error("Method not implemented.");
  }

  protected async applyFilter(
    items: Category[],
    filter: string | null
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  protected applyPaginate(
    items: Category[],
    page: number,
    per_page: number
  ): Category[] {
    throw new Error("Method not implemented.");
  }

  protected applySort(
    items: Category[],
    sort: keyof Category | null,
    sort_dir: SortDirection | null,
    custom_getter?: ((sort: keyof Category, item: Category) => any) | undefined
  ): Category[] {
    return sort
      ? super.applySort(items, sort, sort_dir, custom_getter)
      : super.applySort(items, "created_at", "desc", custom_getter);
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
