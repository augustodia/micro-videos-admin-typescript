import { IUseCase } from '../../../../shared/application/use-case.interface';
import { CastMemberId } from '../../../domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';

export type DeleteCastMemberInput = {
  id: string;
};

type DeleteCastMemberOutput = void;

export class DeleteCastMemberUseCase
  implements IUseCase<DeleteCastMemberInput, DeleteCastMemberOutput>
{
  constructor(private categoryRepo: ICastMemberRepository) {}

  async execute(input: DeleteCastMemberInput): Promise<DeleteCastMemberOutput> {
    const uuid = new CastMemberId(input.id);
    await this.categoryRepo.delete(uuid);
  }
}
