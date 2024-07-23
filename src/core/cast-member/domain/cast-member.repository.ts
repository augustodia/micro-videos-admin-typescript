import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { CastMember } from './cast-member.entity';
import { CastMemberType } from './cast-member-type';

export type CastMemberFilter = {
  name?: string | null;
  type?: CastMemberType | null;
};

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

  get filter(): CastMemberFilter | null {
    return this._filter;
  }

  protected set filter(value: CastMemberFilter | null) {
    const _value =
      !value || (value as unknown) === '' || typeof value !== 'object'
        ? null
        : value;

    const filter = {
      ...(value?.name && { name: `${value.name}` }),
      ...(_value?.type && { type: _value.type }),
    };

    this._filter = Object.keys(filter).length === 0 ? null : filter;
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
