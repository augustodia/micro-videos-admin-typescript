import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { CastMember } from '../../../domain/cast-member.entity';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';

export class CastMemberInMemoryRepository
  extends InMemorySearchableRepository<CastMember, Uuid, string>
  implements ICastMemberRepository
{
  sortableFields: (keyof CastMember)[] = ['name', 'type', 'created_at'];

  protected async applyFilter(
    items: CastMember[],
    filter: string | null,
  ): Promise<CastMember[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.name.toLowerCase().includes(filter.toLowerCase());
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
