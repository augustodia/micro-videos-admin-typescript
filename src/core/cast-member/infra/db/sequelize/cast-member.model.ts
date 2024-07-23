import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export type CastMemberModelProps = {
  cast_member_id: string;
  name: string;
  type: 'actor' | 'director';
  is_active: boolean;
  created_at: Date;
};

@Table({ tableName: 'cast_members', timestamps: false })
export class CastMemberModel extends Model<CastMemberModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare cast_member_id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @Column({ type: DataType.ENUM('actor', 'director'), allowNull: false })
  declare type: 'actor' | 'director';

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_active: boolean;

  @Column({
    type: DataType.DATE(3),
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  declare created_at: Date;
}
