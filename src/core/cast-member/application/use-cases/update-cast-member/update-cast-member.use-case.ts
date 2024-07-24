import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { EntityValidationError } from '../../../../shared/domain/errors/validation.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { CastMemberType } from '../../../domain/cast-member-type';
import { CastMember } from '../../../domain/cast-member.entity';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';
import { CastMemberOutputMapper } from '../common/cast-member-output';
import { UpdateCastMemberInput } from './update-cast-member.input';

export type UpdateCastMemberOutput = {
  id: string;
  name: string;
  type: CastMemberType;
  created_at: Date;
};

export class UpdateCastMemberUseCase
  implements IUseCase<UpdateCastMemberInput, UpdateCastMemberOutput>
{
  constructor(private categoryRepo: ICastMemberRepository) {}

  async execute(input: UpdateCastMemberInput): Promise<UpdateCastMemberOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepo.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.id, CastMember);
    }

    category.update({
      name: input.name,
      type: input.type,
    });

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }

    await this.categoryRepo.update(category);

    return CastMemberOutputMapper.toOutput(category);
  }
}
