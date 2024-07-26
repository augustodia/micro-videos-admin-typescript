import { Module } from '@nestjs/common';
import { CastMembersController } from './cast-members.controller';
import { CastMemberModel } from '../../core/cast-member/infra/db/sequelize/cast-member.model';
import { CAST_MEMBER_PROVIDERS } from './cast-members.providers';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([CastMemberModel])],
  controllers: [CastMembersController],
  providers: [
    ...Object.values(CAST_MEMBER_PROVIDERS.REPOSITORIES),
    ...Object.values(CAST_MEMBER_PROVIDERS.USE_CASES),
  ],
})
export class CastMembersModule {}
