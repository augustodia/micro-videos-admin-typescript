import { IsEnum, IsOptional, validateSync } from 'class-validator';
import { CastMemberType } from '../../../domain/cast-member-type';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { SearchInput } from '../../../../shared/application/search-input';

export class ListCastMembersInput implements SearchInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  name?: string | null;
  @IsOptional()
  @IsEnum(CastMemberType)
  type?: CastMemberType | null;
}

export class ValidateListCastMembersInput {
  static validate(input: ListCastMembersInput) {
    return validateSync(input);
  }
}
