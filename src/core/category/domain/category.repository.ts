import { ISearchableRepository } from './../../shared/domain/repository/repository-interface';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Category } from './category.aggregate';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';

export type CategoryFilter = string;

export type CategorySearchParamsProps = {
  page?: number;
  per_page?: number;
  filter?: CategoryFilter;
  sort?: string;
  sort_dir?: 'asc' | 'desc';
};

export class CategorySearchParams extends SearchParams<CategoryFilter> {
  private constructor(props?: CategorySearchParamsProps) {
    super(props);
  }

  static create(props?: CategorySearchParamsProps) {
    return new CategorySearchParams(props);
  }
}

export class CategorySearchResult extends SearchResult<Category> {}

export interface ICategoryRepository
  extends ISearchableRepository<
    Category,
    Uuid,
    CategoryFilter,
    CategorySearchParams,
    CategorySearchResult
  > {}
