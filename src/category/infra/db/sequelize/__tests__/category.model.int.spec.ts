import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryFakeBuilder } from "../../../../domain/__tests__/category-fake.builder";

describe('CategoryModel Integration Tests', () => {
  it('should create a category', async () => {
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [CategoryModel],
    })

    await sequelize.sync({ force: true });

    const category = CategoryFakeBuilder.aCategory().build();

    CategoryModel.create({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  })
});