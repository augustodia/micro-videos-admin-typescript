import { Entity } from '../../../domain/entity';
import { NotFoundError } from '../../../domain/errors/not-found.error';
import {
  IRepository,
  ISearchableRepository,
} from '../../../domain/repository/repository-interface';
import { ValueObject } from '../../../domain/value-object';
import { SearchParams } from '../../../domain/repository/search-params';
import { SearchResult } from '../../../domain/repository/search-result';
import { InvalidArgumentError } from '../../../domain/errors/invalid-argument.error';

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject,
> implements IRepository<E, EntityId>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async update(entity: E): Promise<void> {
    const indexItem = this.items.findIndex((item) =>
      item.entity_id.equals(entity.entity_id),
    );

    if (indexItem === -1)
      throw new NotFoundError(entity.entity_id, this.getEntity());

    this.items[indexItem] = entity;
  }

  async delete(entity_id: EntityId): Promise<void> {
    const indexItem = this.items.findIndex((item) =>
      item.entity_id.equals(entity_id),
    );

    if (indexItem === -1) throw new NotFoundError(entity_id, this.getEntity());

    this.items.splice(indexItem, 1);
  }

  async findById(entity_id: EntityId): Promise<E | null> {
    const item = this.items.find((item) => item.entity_id.equals(entity_id));

    return typeof item === 'undefined' ? null : item;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  abstract getEntity(): new (...args: any[]) => E;

  async findByIds(ids: EntityId[]): Promise<E[]> {
    //avoid to return repeated items
    return this.items.filter((entity) => {
      return ids.some((id) => entity.entity_id.equals(id));
    });
  }

  async existsById(
    ids: EntityId[],
  ): Promise<{ exists: EntityId[]; not_exists: EntityId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }

    if (this.items.length === 0) {
      return {
        exists: [],
        not_exists: ids,
      };
    }

    const existsId = new Set<EntityId>();
    const notExistsId = new Set<EntityId>();
    ids.forEach((id) => {
      const item = this.items.find((entity) => entity.entity_id.equals(id));
      item ? existsId.add(id) : notExistsId.add(id);
    });
    return {
      exists: Array.from(existsId.values()),
      not_exists: Array.from(notExistsId.values()),
    };
  }
}

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string,
  >
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = [];
  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);
    const itemsSorted = this.applySort(
      itemsFiltered,
      props.sort,
      props.sort_dir,
    );
    const itemsPaginated = this.applyPaginate(
      itemsSorted,
      props.page,
      props.per_page,
    );

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null,
  ): Promise<E[]>;

  protected applyPaginate(
    items: E[],
    page: SearchParams<E>['page'],
    per_page: SearchParams<E>['per_page'],
  ) {
    const start = (page - 1) * per_page;
    const end = start + per_page;

    return items.slice(start, end);
  }

  protected applySort(
    items: E[],
    sort: string | null,
    sort_dir: SearchParams<E>['sort_dir'] | null,
    custom_getter?: (sort: string, item: E) => any,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) return items;

    return [...items].sort((a, b) => {
      const aValue = custom_getter ? custom_getter(sort, a) : a[sort];
      const bValue = custom_getter ? custom_getter(sort, b) : b[sort];
      if (aValue < bValue) return sort_dir === 'asc' ? -1 : 1;

      if (aValue > bValue) return sort_dir === 'asc' ? 1 : -1;

      return 0;
    });
  }
}
