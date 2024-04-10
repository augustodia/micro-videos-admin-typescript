import { ListCategoriesInput } from '../../../core/category/application/use-cases/list-categories.use-case';
import { Category } from '../../../core/category/domain/category.entity';
import { CategoryFilter } from '../../../core/category/domain/category.repository';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';

export class SearchCategoriesDto implements ListCategoriesInput {
  page?: number;
  per_page?: number;
  sort?: keyof Category;
  sort_dir?: SortDirection;
  filter?: CategoryFilter;
}
