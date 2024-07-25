import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from './../cast-members.presenter';
import { CreateCastMemberDto } from '../dto/create-cast-member.dto';
import { CastMembersController } from '../cast-members.controller';
import { ListCastMembersOutput } from '../../../core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case';
import { GetCastMemberOutput } from '../../../core/cast-member/application/use-cases/get-cast-member/get-cast-member.use-case';
import { UpdateCastMemberOutput } from '../../../core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case';
import { CreateCastMemberOutput } from '../../../core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { CastMemberType } from '../../../core/cast-member/domain/cast-member-type';
import { UpdateCastMemberInput } from '../../../core/cast-member/application/use-cases/update-cast-member/update-cast-member.input';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';

describe('CastMembersController Unit Tests', () => {
  let controller: CastMembersController;

  const outputCreateCastMember: CreateCastMemberOutput = {
    id: '9366b7dc-2d71-4799-b91c-c64adb205104',
    name: 'Actor',
    type: CastMemberType.ACTOR,
    created_at: new Date(),
  };
  const mockCreateUseCase = {
    execute: jest.fn().mockReturnValue(Promise.resolve(outputCreateCastMember)),
  };

  const outputUpdateCastMember: UpdateCastMemberOutput = {
    id: '9366b7dc-2d71-4799-b91c-c64adb205104',
    name: 'Actor',
    type: CastMemberType.ACTOR,
    created_at: new Date(),
  };
  const mockUpdateUseCase = {
    execute: jest.fn().mockReturnValue(Promise.resolve(outputUpdateCastMember)),
  };

  const outputDeleteCastMember = undefined;
  const mockDeleteUseCase = {
    execute: jest.fn().mockReturnValue(Promise.resolve(outputDeleteCastMember)),
  };

  const outputGetCastMember: GetCastMemberOutput = {
    id: '9366b7dc-2d71-4799-b91c-c64adb205104',
    name: 'Actor',
    type: CastMemberType.ACTOR,
    created_at: new Date(),
  };
  const mockGetUseCase = {
    execute: jest.fn().mockReturnValue(Promise.resolve(outputGetCastMember)),
  };

  const outputListCastMember: ListCastMembersOutput = {
    items: [
      {
        id: '9366b7dc-2d71-4799-b91c-c64adb205104',
        name: 'Actor',
        type: CastMemberType.ACTOR,
        created_at: new Date(),
      },
    ],
    current_page: 1,
    last_page: 1,
    per_page: 1,
    total: 1,
  };
  const mockListUseCase = {
    execute: jest.fn().mockReturnValue(Promise.resolve(outputListCastMember)),
  };

  beforeEach(async () => {
    controller = new CastMembersController(
      //@ts-expect-error defined part of methods
      mockCreateUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase,
      mockGetUseCase,
      mockListUseCase,
    );
  });

  it('should creates a cast-member', async () => {
    //Arrange
    const input: CreateCastMemberDto = {
      name: 'Actor',
      type: CastMemberType.ACTOR,
    };

    //Act
    const presenter = await controller.create(input);

    //Assert
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(
      new CastMemberPresenter(outputCreateCastMember),
    );
  });

  it('should updates a cast-member', async () => {
    const input: UpdateCastMemberInput = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Actor',
      type: CastMemberType.ACTOR,
    };
    const presenter = await controller.update(input.id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id: input.id,
      ...input,
    });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(
      new CastMemberPresenter(outputUpdateCastMember),
    );
  });

  it('should deletes a cast-member', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(outputDeleteCastMember).toStrictEqual(output);
  });

  it('should gets a cast-member', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(
      new CastMemberPresenter(outputGetCastMember),
    );
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
      new CastMemberCollectionPresenter(outputListCastMember),
    );
  });
});
