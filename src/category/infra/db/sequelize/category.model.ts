import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({ tableName: "categories", timestamps: false })
export class CategoryModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare category_id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT })
  declare description: string | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_active: boolean;

  @Column({
    type: DataType.DATE(3),
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  
  declare created_at: Date;
}
