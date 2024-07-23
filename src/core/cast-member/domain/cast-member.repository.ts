import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { CastMember } from './cast-member.entity';

export type CastMemberFilter = string;

export type CastMemberSearchParamsProps = {
  page?: number;
  per_page?: number;
  filter?: CastMemberFilter;
  sort?: string;
  sort_dir?: 'asc' | 'desc';
};

export class CastMemberSearchParams extends SearchParams<CastMemberFilter> {
  constructor(props?: CastMemberSearchParamsProps) {
    const sortProps = CastMemberSearchParams.determineSortProps(props);

    super({
      page: props?.page,
      per_page: props?.per_page,
      filter: props?.filter,
      sort: sortProps.sort,
      sort_dir: sortProps.sort_dir,
    });
  }

  private static determineSortProps(
    props?: CastMemberSearchParamsProps,
  ): CastMemberSearchParamsProps {
    if (!props?.sort || (!props?.sort && !props?.sort_dir)) {
      return { sort: 'created_at', sort_dir: 'desc' };
    }

    return { sort: props.sort, sort_dir: props.sort_dir };
  }
}

export class CastMemberSearchResult extends SearchResult<CastMember> {}

export interface ICastMemberRepository
  extends ISearchableRepository<
    CastMember,
    Uuid,
    CastMemberFilter,
    CastMemberSearchParams,
    CastMemberSearchResult
  > {}
