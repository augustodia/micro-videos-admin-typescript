import { DataType, Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";

describe("CategoryModel Integration Tests", () => {
  let sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
      logging: false
    });
    await sequelize.sync({ force: true });
  });

  test("mapping props", () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());
    console.log(attributes, attributesMap);
    expect(attributes).toStrictEqual([
      "category_id",
      "name",
      "description",
      "is_active",
      "created_at",
    ]);

    const categoryIdAttr = attributesMap.category_id;
    expect(categoryIdAttr).toMatchObject({
      field: "category_id",
      fieldName: "category_id",
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      allowNull: false,
      field: "name",
      fieldName: "name",
      type: DataType.STRING(255),
    });

    const descriptionAttr = attributesMap.description;
    console.log(descriptionAttr)
    expect(descriptionAttr).toMatchObject({
      field: "description",
      fieldName: "description",
      type: DataType.TEXT(),
    });

    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      field: "is_active",
      fieldName: "is_active",
      type: DataType.BOOLEAN(),
    });

    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      allowNull: false,
      field: "created_at",
      fieldName: "created_at",
      type: DataType.DATE(3),
    });
  });

  test("create", async () => {
    const arrange = {
      category_id: "9366b7dc-2d71-4799-b91c-c64adb205104",
      name: "test",
      is_active: true,
      created_at: new Date(),
    };

    const category = await CategoryModel.create(arrange);

    expect(category.toJSON()).toStrictEqual(arrange);
  });
});