import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/nest-modules/shared/testing/helpers';
import { ICastMemberRepository } from '../../src/core/cast-member/domain/cast-member.repository';
import { CAST_MEMBER_PROVIDERS } from '../../src/nest-modules/cast-members/cast-members.providers';
import { CastMemberFakeBuilder } from '../../src/core/cast-member/domain/cast-member-fake.builder';
import { GetCastMemberFixture } from '../../src/nest-modules/cast-members/testing/fixture/cast-member.fixture';
import { CastMembersController } from '../../src/nest-modules/cast-members/cast-members.controller';
import { CastMemberOutputMapper } from '../../src/core/cast-member/application/use-cases/common/cast-member-output';

describe('CastMembersController (e2e)', () => {
  const nestApp = startApp();
  describe('/cast-members/:id (GET)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'CastMember Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/cast-members/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should return a category ', async () => {
      const categoryRepo = nestApp.app.get<ICastMemberRepository>(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );
      const category = CastMemberFakeBuilder.aCastMember().build();
      await categoryRepo.insert(category);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/cast-members/${category.cast_member_id.id}`)
        .expect(200);
      const keyInResponse = GetCastMemberFixture.keysInResponse;
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

      const presenter = CastMembersController.serialize(
        CastMemberOutputMapper.toOutput(category),
      );
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
