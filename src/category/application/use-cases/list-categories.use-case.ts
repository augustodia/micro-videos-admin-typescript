import { PaginationOutput, PaginationOutputMapper } from "../../../shared/application/pagination-output";
import { IUseCase } from "../../../shared/application/use-case.interface";
import { SortDirection } from "../../../shared/domain/repository/search-params";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository, CategorySearchParams, CategorySearchResult, CategoryFilter } from "../../domain/category.repository";
import { CategoryOutputMapper, CategoryOutput } from "./common/category-output";


export type ListCategoriesInput = {
  page?: number;
  per_page?: number;
  sort?: keyof Category;
  sort_dir?: SortDirection;
  filter?: CategoryFilter;
};

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>;


export class ListCategoriesUseCase
  implements IUseCase<ListCategoriesInput, ListCategoriesOutput>
{
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const params = new CategorySearchParams(input);
    const searchResult = await this.categoryRepo.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategorySearchResult): ListCategoriesOutput {
    const { items: _items } = searchResult;
    const items = _items.map((i) => {
      return CategoryOutputMapper.toOutput(i);
    });
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}
