import { Entity } from '../entity';
import { ValueObject } from '../value-object';

export type SortDirection = 'asc' | 'desc';

export type SearchParamsConstructorProps<E extends Entity, Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: keyof E | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams<
  E extends Entity,
  Filter = string,
> extends ValueObject {
  protected _page: number = 1;
  protected _per_page: number = 15;
  protected _sort: keyof E | null;
  protected _sort_dir: SortDirection | null;
  protected _filter: Filter | null;

  constructor(props: SearchParamsConstructorProps<E, Filter> = {}) {
    super();
    this.page = props.page ?? 1;
    this.per_page = props.per_page ?? 15;
    this.sort = props.sort ?? null;
    this.sort_dir = props.sort_dir ?? null;
    this.filter = props.filter ?? null;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {
    let _page = Number(value);

    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }

    this._page = _page;
  }

  get per_page() {
    return this._per_page;
  }

  private set per_page(value: number) {
    let _per_page = value === (true as any) ? this._per_page : Number(value);

    if (
      Number.isNaN(_per_page) ||
      _per_page <= 0 ||
      parseInt(_per_page as any) !== _per_page
    ) {
      _per_page = this._per_page;
    }

    this._per_page = _per_page;
  }

  get sort(): keyof E | null {
    return this._sort;
  }

  private set sort(value: keyof E | null) {
    this._sort =
      value === null || value === undefined || value === ''
        ? null
        : (String(value) as keyof E);
  }

  get sort_dir(): SortDirection {
    return this._sort_dir ?? 'asc';
  }

  private set sort_dir(value: SortDirection | null) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }
    const dir = `${value}`.toLowerCase();
    this._sort_dir = dir !== 'asc' && dir !== 'desc' ? 'asc' : dir;
  }

  get filter(): Filter | null {
    return this._filter;
  }

  protected set filter(value: Filter | null) {
    this._filter =
      value === null || value === undefined || (value as unknown) === ''
        ? null
        : (`${value}` as any);
  }
}
