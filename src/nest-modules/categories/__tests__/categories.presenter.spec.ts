import { CreateCategoryOutput } from '../../../core/category/application/use-cases/create-category/create-category.use-case';
import { GetCategoryOutput } from '../../../core/category/application/use-cases/get-category.use-case';
import { ListCategoriesOutput } from '../../../core/category/application/use-cases/list-categories.use-case';
import { UpdateCategoryInput } from '../../../core/category/application/use-cases/update-category/update-category.input';
import { UpdateCategoryOutput } from '../../../core/category/application/use-cases/update-category/update-category.use-case';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';
import { CategoriesController } from '../categories.controller';
import {
  CategoryPresenter,
  CategoryCollectionPresenter,
} from '../categories.presenter';
import { CreateCategoryDto } from '../dto/create-category.dto';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  const outputCreateCategory: CreateCategoryOutput = {
    id: '9366b7dc-2d71-4799-b91c-c64adb205104',
    name: 'Movie',
    description: 'some description',
    is_active: true,
    created_at: new Date(),
  };
  const mockCreateUseCase = {
    execute: jest.fn().mockReturnValue(Promise.resolve(outputCreateCategory)),
  };

  const outputUpdateCategory: UpdateCategoryOutput = {
    id: '9366b7dc-2d71-4799-b91c-c64adb205104',
    name: 'Movie',
    description: 'some description',
    is_active: true,
    created_at: new Date(),
  };
  const mockUpdateUseCase = {
    execute: jest.fn().mockReturnValue(Promise.resolve(outputUpdateCategory)),
  };

  const outputDeleteCategory = undefined;
  const mockDeleteUseCase = {
    execute: jest.fn().mockReturnValue(Promise.resolve(outputDeleteCategory)),
  };

  const outputGetCategory: GetCategoryOutput = {
    id: '9366b7dc-2d71-4799-b91c-c64adb205104',
    name: 'Movie',
    description: 'some description',
    is_active: true,
    created_at: new Date(),
  };
  const mockGetUseCase = {
    execute: jest.fn().mockReturnValue(Promise.resolve(outputGetCategory)),
  };

  const outputListCategory: ListCategoriesOutput = {
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
  const mockListUseCase = {
    execute: jest.fn().mockReturnValue(Promise.resolve(outputListCategory)),
  };

  beforeEach(async () => {
    controller = new CategoriesController(
      //@ts-expect-error defined part of methods
      mockCreateUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
      mockGetUseCase,
      mockListUseCase,
    );
  });

  it('should creates a category', async () => {
    //Arrange
    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    //Act
    const presenter = await controller.create(input);

    //Assert
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(
      new CategoryPresenter(outputCreateCategory),
    );
  });

  it('should updates a category', async () => {
    const input: UpdateCategoryInput = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };
    const presenter = await controller.update(input.id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id: input.id,
      ...input,
    });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(
      new CategoryPresenter(outputUpdateCategory),
    );
  });

  it('should deletes a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(outputDeleteCategory).toStrictEqual(output);
  });

  it('should gets a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(outputGetCategory));
  });

  it('should list categories', async () => {
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };

    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(
      new CategoryCollectionPresenter(outputListCategory),
    );
  });
});
