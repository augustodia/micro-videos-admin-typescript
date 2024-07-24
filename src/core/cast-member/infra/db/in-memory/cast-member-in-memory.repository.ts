import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { CastMemberType } from '../../../domain/cast-member-type';
import { CastMember } from '../../../domain/cast-member.entity';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';

type CastMemberFilter = {
  name?: string | null;
  type?: CastMemberType | null;
};

export class CastMemberInMemoryRepository
  extends InMemorySearchableRepository<CastMember, Uuid, CastMemberFilter>
  implements ICastMemberRepository
{
  sortableFields: (keyof CastMember)[] = ['name', 'type', 'created_at'];

  protected async applyFilter(
    items: CastMember[],
    filter: CastMemberFilter | null,
  ): Promise<CastMember[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => {
      if (
        filter.name &&
        !item.name.toLocaleLowerCase().includes(filter.name.toLocaleLowerCase())
      ) {
        return false;
      }

      if (filter.type && item.type !== filter.type) {
        return false;
      }

      return true;
    });
  }

  protected applySort(
    items: CastMember[],
    sort: keyof CastMember | null,
    sort_dir: SortDirection | null,
    custom_getter?:
      | ((sort: keyof CastMember, item: CastMember) => any)
      | undefined,
  ): CastMember[] {
    return sort
      ? super.applySort(items, sort, sort_dir, custom_getter)
      : super.applySort(items, 'created_at', 'desc', custom_getter);
  }

  getEntity(): new (...args: any[]) => CastMember {
    return CastMember;
  }
}
