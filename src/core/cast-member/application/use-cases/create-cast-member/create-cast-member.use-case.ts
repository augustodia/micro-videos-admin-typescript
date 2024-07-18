export type CreateCastMemberOutput = CategoryOutput;
export class CreateCategoryUseCase
  implements IUseCase<CreateCategoryInput, CreateCastMemberOutput>
{
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCastMemberOutput> {
    const entity = Category.create(input);

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    await this.categoryRepo.insert(entity);

    return CategoryOutputMapper.toOutput(entity);
  }
}
