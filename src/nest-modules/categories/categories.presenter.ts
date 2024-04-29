import { Transform } from 'class-transformer';
import { CategoryOutput } from '../../core/category/application/use-cases/common/category-output';
import { ListCategoriesOutput } from '../../core/category/application/use-cases/list-categories.use-case';
import { CollectionPresenter } from '../shared/collection.presenter';

export class CategoryPresenter {
  id: string;
  name: string;
  is_active: boolean;
  description: string | null;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: CategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.is_active = output.is_active;
    this.created_at = output.created_at;
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  data: CategoryPresenter[];

  constructor(output: ListCategoriesOutput) {
    const { items, ...searchProps } = output;
    super(searchProps);

    this.data = items.map((item) => new CategoryPresenter(item));
  }
}
