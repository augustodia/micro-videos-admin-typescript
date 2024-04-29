import {
  CreateCategoryOutput,
  CreateCategoryUseCase,
} from '../../../../core/category/application/use-cases/create-category/create-category.use-case';
import { DeleteCategoryUseCase } from '../../../../core/category/application/use-cases/delete-category.use-case';
import {
  GetCategoryOutput,
  GetCategoryUseCase,
} from '../../../../core/category/application/use-cases/get-category.use-case';
import {
  ListCategoriesOutput,
  ListCategoriesUseCase,
} from '../../../../core/category/application/use-cases/list-categories.use-case';
import {
  UpdateCategoryOutput,
  UpdateCategoryUseCase,
} from '../../../../core/category/application/use-cases/update-category/update-category.use-case';

//#region Create
const outputCreateUseCase: CreateCategoryOutput = {
  id: '9366b7dc-2d71-4799-b91c-c64adb205104',
  name: 'Movie',
  description: 'some description',
  is_active: true,
  created_at: new Date(),
};

class MockCreateCategoryUseCase extends CreateCategoryUseCase {
  constructor() {
    super(null as any);
  }

  execute = jest.fn().mockResolvedValue(outputCreateUseCase);
}
//#endregion

//#region Update
const outputUpdateUseCase: UpdateCategoryOutput = {
  id: '9366b7dc-2d71-4799-b91c-c64adb205104',
  name: 'Movie',
  description: 'some description',
  is_active: true,
  created_at: new Date(),
};

class MockUpdateCategoryUseCase extends UpdateCategoryUseCase {
  constructor() {
    super(null as any);
  }

  execute = jest.fn().mockResolvedValue(outputUpdateUseCase);
}
//#endregion

//#region Delete
const outputDeleteUseCase = undefined;

class MockDeleteCategoryUseCase extends DeleteCategoryUseCase {
  constructor() {
    super(null as any);
  }

  execute = jest.fn().mockResolvedValue(outputDeleteUseCase);
}
//#region

//#region Get
const outputGetUseCase: GetCategoryOutput = {
  id: '9366b7dc-2d71-4799-b91c-c64adb205104',
  name: 'Movie',
  description: 'some description',
  is_active: true,
  created_at: new Date(),
};

class MockGetCategoryUseCase extends GetCategoryUseCase {
  constructor() {
    super(null as any);
  }

  execute = jest.fn().mockResolvedValue(outputGetUseCase);
}
//#endregion

//#region List
const outputListUseCase: ListCategoriesOutput = {
  items: [
    {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    },
  ],
  current_page: 1,
  last_page: 1,
  per_page: 1,
  total: 1,
};

class MockListCategoriesUseCase extends ListCategoriesUseCase {
  constructor() {
    super(null as any);
  }

  execute = jest.fn().mockResolvedValue(outputListUseCase);
}
//#endregion

export {
  MockCreateCategoryUseCase,
  MockUpdateCategoryUseCase,
  MockDeleteCategoryUseCase,
  MockGetCategoryUseCase,
  MockListCategoriesUseCase,
  outputCreateUseCase,
  outputUpdateUseCase,
  outputDeleteUseCase,
  outputGetUseCase,
  outputListUseCase,
};
