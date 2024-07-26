import {
  CreateCastMemberOutput,
  CreateCastMemberUseCase,
} from '../../../../core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { DeleteCastMemberUseCase } from '../../../../core/cast-member/application/use-cases/delete-cast-member/delete-cast-member.use-case';
import {
  GetCastMemberOutput,
  GetCastMemberUseCase,
} from '../../../../core/cast-member/application/use-cases/get-cast-member/get-cast-member.use-case';
import {
  ListCastMembersOutput,
  ListCastMembersUseCase,
} from '../../../../core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case';
import {
  UpdateCastMemberOutput,
  UpdateCastMemberUseCase,
} from '../../../../core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case';
import { CastMemberType } from '../../../../core/cast-member/domain/cast-member-type';

//#region Create
const outputCreateUseCase: CreateCastMemberOutput = {
  id: '9366b7dc-2d71-4799-b91c-c64adb205104',
  name: 'Actor',
  type: CastMemberType.ACTOR,
  created_at: new Date(),
};

class MockCreateCastMemberUseCase extends CreateCastMemberUseCase {
  constructor() {
    super(null as any);
  }

  execute = jest.fn().mockResolvedValue(outputCreateUseCase);
}
//#endregion

//#region Update
const outputUpdateUseCase: UpdateCastMemberOutput = {
  id: '9366b7dc-2d71-4799-b91c-c64adb205104',
  name: 'Actor',
  type: CastMemberType.ACTOR,
  created_at: new Date(),
};

class MockUpdateCastMemberUseCase extends UpdateCastMemberUseCase {
  constructor() {
    super(null as any);
  }

  execute = jest.fn().mockResolvedValue(outputUpdateUseCase);
}
//#endregion

//#region Delete
const outputDeleteUseCase = undefined;

class MockDeleteCastMemberUseCase extends DeleteCastMemberUseCase {
  constructor() {
    super(null as any);
  }

  execute = jest.fn().mockResolvedValue(outputDeleteUseCase);
}
//#region

//#region Get
const outputGetUseCase: GetCastMemberOutput = {
  id: '9366b7dc-2d71-4799-b91c-c64adb205104',
  name: 'Actor',
  type: CastMemberType.ACTOR,
  created_at: new Date(),
};

class MockGetCastMemberUseCase extends GetCastMemberUseCase {
  constructor() {
    super(null as any);
  }

  execute = jest.fn().mockResolvedValue(outputGetUseCase);
}
//#endregion

//#region List
const outputListUseCase: ListCastMembersOutput = {
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

class MockListCastMembersUseCase extends ListCastMembersUseCase {
  constructor() {
    super(null as any);
  }

  execute = jest.fn().mockResolvedValue(outputListUseCase);
}
//#endregion

export {
  MockCreateCastMemberUseCase,
  MockUpdateCastMemberUseCase,
  MockDeleteCastMemberUseCase,
  MockGetCastMemberUseCase,
  MockListCastMembersUseCase,
  outputCreateUseCase,
  outputUpdateUseCase,
  outputDeleteUseCase,
  outputGetUseCase,
  outputListUseCase,
};
