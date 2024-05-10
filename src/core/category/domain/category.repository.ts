import { ISearchableRepository } from './../../shared/domain/repository/repository-interface';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Category } from './category.entity';
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
  constructor(props?: CategorySearchParamsProps) {
    const sortProps = CategorySearchParams.determineSortProps(props);

    super({
      page: props?.page,
      per_page: props?.per_page,
      filter: props?.filter,
      sort: sortProps.sort,
      sort_dir: sortProps.sort_dir,
    });
  }

  private static determineSortProps(
    props?: CategorySearchParamsProps,
  ): CategorySearchParamsProps {
    if (!props?.sort || (!props?.sort && !props?.sort_dir)) {
      return { sort: 'created_at', sort_dir: 'desc' };
    }

    return { sort: props.sort, sort_dir: props.sort_dir };
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
