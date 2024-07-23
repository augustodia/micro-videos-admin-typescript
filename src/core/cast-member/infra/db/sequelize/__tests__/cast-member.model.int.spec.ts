import { DataType } from 'sequelize-typescript';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberModel } from '../cast-member.model';

describe('CastMemberModel Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  test('mapping props', () => {
    const attributesMap = CastMemberModel.getAttributes();
    const attributes = Object.keys(CastMemberModel.getAttributes());
    expect(attributes).toStrictEqual([
      'cast_member_id',
      'name',
      'type',
      'is_active',
      'created_at',
    ]);

    const categoryIdAttr = attributesMap.cast_member_id;
    expect(categoryIdAttr).toMatchObject({
      field: 'cast_member_id',
      fieldName: 'cast_member_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      allowNull: false,
      field: 'name',
      fieldName: 'name',
      type: DataType.STRING(255),
    });

    const typeAttr = attributesMap.type;
    expect(typeAttr).toMatchObject({
      field: 'type',
      fieldName: 'type',
      type: DataType.ENUM('actor', 'director'),
    });

    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      type: DataType.BOOLEAN(),
    });

    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      allowNull: false,
      field: 'created_at',
      fieldName: 'created_at',
      type: DataType.DATE(3),
    });
  });

  test('create', async () => {
    const arrange: any = {
      cast_member_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'test',
      type: 'actor',
      is_active: true,
      created_at: new Date(),
    };

    const category = await CastMemberModel.create(arrange);

    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
