import { CastMemberFakeBuilder } from '../../../../core/cast-member/domain/cast-member-fake.builder';
import { CastMemberType } from '../../../../core/cast-member/domain/cast-member-type';

const _keysInResponse = ['id', 'name', 'type', 'created_at'];

export class GetCastMemberFixture {
  static readonly keysInResponse = _keysInResponse;
}

export class CreateCastMemberFixture {
  static readonly keysInResponse = _keysInResponse;

  static arrangeForCreate() {
    const faker = CastMemberFakeBuilder.aCastMember()
      .withName('Actor')
      .withType(CastMemberType.ACTOR);
    return [
      {
        send_data: {
          name: faker.name,
          type: CastMemberType.ACTOR,
        },
        expected: {
          name: faker.name,
          type: CastMemberType.ACTOR,
        },
      },
      {
        send_data: {
          name: faker.name,
          type: faker.type,
        },
        expected: {
          name: faker.name,
          type: faker.type,
        },
      },
      {
        send_data: {
          name: faker.name,
          type: CastMemberType.DIRECTOR,
        },
        expected: {
          name: faker.name,
          type: CastMemberType.DIRECTOR,
        },
      },
      {
        send_data: {
          name: faker.name,
          type: CastMemberType.ACTOR,
        },
        expected: {
          name: faker.name,
          type: CastMemberType.ACTOR,
        },
      },
      {
        send_data: {
          name: faker.name,
          type: faker.type,
        },
        expected: {
          name: faker.name,
          type: faker.type,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: undefined,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: null,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: '',
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      TYPE_IS_NOT_VALID: {
        send_data: {
          type: 'invalid',
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'type must be one of the following values: 1, 2',
          ],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = CastMemberFakeBuilder.aCastMember();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        send_data: {
          name: faker.withInvalidNameTooLong().name,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class UpdateCastMemberFixture {
  static readonly keysInResponse = _keysInResponse;

  static arrangeForUpdate() {
    const faker = CastMemberFakeBuilder.aCastMember()
      .withName('Director')
      .withType(CastMemberType.DIRECTOR);
    return [
      {
        send_data: {
          name: faker.name,
          type: CastMemberType.ACTOR,
        },
        expected: {
          name: faker.name,
          type: CastMemberType.ACTOR,
        },
      },
      {
        send_data: {
          name: faker.name,
          type: faker.type,
        },
        expected: {
          name: faker.name,
          type: faker.type,
        },
      },
      {
        send_data: {
          name: faker.name,
        },
        expected: {
          name: faker.name,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      TYPE_IS_NOT_VALID: {
        send_data: {
          type: 'invalid',
        },
        expected: {
          message: ['type must be one of the following values: 1, 2'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = CastMemberFakeBuilder.aCastMember();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        send_data: {
          name: faker.withInvalidNameTooLong().name,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class ListCastMembersFixture {
  static arrangeIncrementedWithCreatedAt() {
    const _entities = CastMemberFakeBuilder.theCastMembers(4)
      .withName((i) => 'aaa' + i)
      .withCreatedAt((i) => new Date(new Date().getTime() + i * 2000))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.fourth, entitiesMap.third],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.second, entitiesMap.first],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const faker = CastMemberFakeBuilder.aCastMember();

    const entitiesMap = {
      aaa: faker.withName('aaa').build(),
      AAA: faker.withName('AAA').build(),
      AaA: faker.withName('AaA').build(),
      bbb: faker.withName('bbb').build(),
      ccc: faker.withName('ccc').build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: {
            name: 'a',
          },
        },
        expected: {
          entities: [entitiesMap.AAA, entitiesMap.AaA],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: {
            name: 'a',
          },
        },
        expected: {
          entities: [entitiesMap.aaa],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }
}
