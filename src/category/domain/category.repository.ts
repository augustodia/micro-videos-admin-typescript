import { ISearchableRepository } from './../../shared/domain/repository/repository-interface';
import { Uuid } from "src/shared/domain/value-objects/uuid.vo";
import { Category } from "./category.entity";
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';

export type CategoryFilter = string;

export class CategorySearchParams extends SearchParams<Category, CategoryFilter> {}

export class CategorySearchResult extends SearchResult<Category> {}

export interface ICategoryRepository extends ISearchableRepository<Category, Uuid, CategoryFilter, CategorySearchParams, CategorySearchResult> {
  
}