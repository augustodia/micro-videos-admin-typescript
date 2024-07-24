import { ListCastMembersInput } from './../../../core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';
import { CastMemberFilter } from '../../../core/cast-member/domain/cast-member.repository';

export class SearchCastMembersDto implements ListCastMembersInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: CastMemberFilter;
}
