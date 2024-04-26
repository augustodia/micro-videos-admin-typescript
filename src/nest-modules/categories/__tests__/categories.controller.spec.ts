import { UpdateCategoryInput } from '../../../core/category/application/use-cases/update-category/update-category.input';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';
import { CategoriesController } from '../categories.controller';
import {
  CategoryPresenter,
  CategoryCollectionPresenter,
} from '../categories.presenter';
import { CreateCategoryDto } from '../dto/create-category.dto';
import {
  MockCreateCategoryUseCase,
  MockDeleteCategoryUseCase,
  MockGetCategoryUseCase,
  MockListCategoriesUseCase,
  MockUpdateCategoryUseCase,
  outputCreateUseCase,
  outputDeleteUseCase,
  outputGetUseCase,
  outputListUseCase,
  outputUpdateUseCase,
} from './mocks/categories.usecases.mocks';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  const mockCreateUseCase = new MockCreateCategoryUseCase();
  const mockUpdateUseCase = new MockUpdateCategoryUseCase();
  const mockDeleteUseCase = new MockDeleteCategoryUseCase();
  const mockGetUseCase = new MockGetCategoryUseCase();

  const mockListUseCase = new MockListCategoriesUseCase();

  beforeEach(async () => {
    controller = new CategoriesController(
      mockCreateUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
      mockGetUseCase,
      mockListUseCase,
    );
  });

  it('should creates a category', async () => {
    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const presenter = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(outputCreateUseCase));
  });

  it('should updates a category', async () => {
    const input: Omit<UpdateCategoryInput, 'id'> = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const presenter = await controller.update(outputUpdateUseCase.id, input);

    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id: outputUpdateUseCase.id,
      ...input,
    });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(outputUpdateUseCase));
  });

  it('should deletes a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';

    const output = await controller.remove(id);

    expect(controller.remove(id)).toBeInstanceOf(Promise);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(outputDeleteUseCase).toStrictEqual(output);
  });

  it('should gets a category', async () => {
    const presenter = await controller.findOne(outputGetUseCase.id);

    expect(mockGetUseCase.execute).toHaveBeenCalledWith({
      id: outputGetUseCase.id,
    });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(outputGetUseCase));
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
      new CategoryCollectionPresenter(outputListUseCase),
    );
  });
});
