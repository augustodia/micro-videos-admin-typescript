import { UpdateCastMemberInput } from '../../../core/cast-member/application/use-cases/update-cast-member/update-cast-member.input';
import { CastMemberType } from '../../../core/cast-member/domain/cast-member-type';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';
import { CastMembersController } from '../cast-members.controller';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from '../cast-members.presenter';
import { CreateCastMemberDto } from '../dto/create-cast-member.dto';
import {
  MockCreateCastMemberUseCase,
  MockDeleteCastMemberUseCase,
  MockGetCastMemberUseCase,
  MockListCastMembersUseCase,
  MockUpdateCastMemberUseCase,
  outputCreateUseCase,
  outputDeleteUseCase,
  outputGetUseCase,
  outputListUseCase,
  outputUpdateUseCase,
} from '../testing/mocks/cast-members.usecases.mocks';

describe('CastMembersController Unit Tests', () => {
  let controller: CastMembersController;

  const mockCreateUseCase = new MockCreateCastMemberUseCase();
  const mockUpdateUseCase = new MockUpdateCastMemberUseCase();
  const mockDeleteUseCase = new MockDeleteCastMemberUseCase();
  const mockGetUseCase = new MockGetCastMemberUseCase();

  const mockListUseCase = new MockListCastMembersUseCase();

  beforeEach(async () => {
    controller = new CastMembersController(
      mockCreateUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
      mockGetUseCase,
      mockListUseCase,
    );
  });

  it('should creates a cast-member', async () => {
    const input: CreateCastMemberDto = {
      name: 'Actor',
      type: CastMemberType.ACTOR,
    };

    const presenter = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(
      new CastMemberPresenter(outputCreateUseCase),
    );
  });

  it('should updates a cast-member', async () => {
    const input: Omit<UpdateCastMemberInput, 'id'> = {
      name: 'Actor',
      type: CastMemberType.ACTOR,
    };

    const presenter = await controller.update(outputUpdateUseCase.id, input);

    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id: outputUpdateUseCase.id,
      ...input,
    });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(
      new CastMemberPresenter(outputUpdateUseCase),
    );
  });

  it('should deletes a cast-member', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';

    const output = await controller.remove(id);

    expect(controller.remove(id)).toBeInstanceOf(Promise);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(outputDeleteUseCase).toStrictEqual(output);
  });

  it('should gets a cast-member', async () => {
    const presenter = await controller.findOne(outputGetUseCase.id);

    expect(mockGetUseCase.execute).toHaveBeenCalledWith({
      id: outputGetUseCase.id,
    });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(outputGetUseCase));
  });

  it('should list categories', async () => {
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: {
        name: 'test',
      },
    };

    const presenter = await controller.search(searchParams);

    expect(presenter).toBeInstanceOf(CastMemberCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(
      new CastMemberCollectionPresenter(outputListUseCase),
    );
  });
});
