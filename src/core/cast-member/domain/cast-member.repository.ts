import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import {
  SearchParams,
  SearchParamsConstructorProps,
} from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { CastMember, CastMemberId } from './cast-member.aggregate';
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
  private constructor(
    props: SearchParamsConstructorProps<CastMemberFilter> = {},
  ) {
    super(props);
  }

  static create(
    props: Omit<SearchParamsConstructorProps<CastMemberFilter>, 'filter'> & {
      name?: string | null;
      type?: CastMemberType | null;
    } = {},
  ) {
    const sortProps = CastMemberSearchParams.determineSortProps({
      sort: props.sort,
      sort_dir: props.sort_dir,
    });

    return new CastMemberSearchParams({
      ...props,
      sort: sortProps.sort,
      sort_dir: sortProps.sort_dir,
      filter: {
        name: props.name,
        type: props.type || null,
      },
    });
  }

  private static determineSortProps(
    props?: SearchParamsConstructorProps<CastMemberFilter>,
  ): CastMemberSearchParamsProps {
    if (!props?.sort || (!props?.sort && !props?.sort_dir)) {
      return { sort: 'created_at', sort_dir: 'desc' };
    }

    return { sort: props.sort, sort_dir: props.sort_dir ?? 'asc' };
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
    CastMemberId,
    CastMemberFilter,
    CastMemberSearchParams,
    CastMemberSearchResult
  > {}
