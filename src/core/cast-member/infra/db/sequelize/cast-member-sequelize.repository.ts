import { literal, Op } from 'sequelize';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { CastMemberModel } from './cast-member.model';
import { CastMember } from '../../../domain/cast-member.entity';
import {
  CastMemberSearchParams,
  CastMemberSearchResult,
  ICastMemberRepository,
} from '../../../domain/cast-member.repository';
import { CastMemberModelMapper } from './cast-member-model-mapper';

export class CastMemberSequelizeRepository implements ICastMemberRepository {
  sortableFields: string[] = ['name', 'type', 'created_at'];
  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`), //ascii
    },
  };

  constructor(private castMemberModel: typeof CastMemberModel) {}

  async search(props: CastMemberSearchParams): Promise<CastMemberSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const { rows: models, count } = await this.castMemberModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: this.formatSort(props.sort, props.sort_dir) }
        : {}),
      offset,
      limit,
    });
    return new CastMemberSearchResult({
      items: models.map((model) => {
        return CastMemberModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  async insert(entity: CastMember): Promise<void> {
    const model = CastMemberModelMapper.toModel(entity);
    await this.castMemberModel.create(model.toJSON());
  }

  async bulkInsert(entities: CastMember[]): Promise<void> {
    const models = entities.map((entity) =>
      CastMemberModelMapper.toModel(entity).toJSON(),
    );
    await this.castMemberModel.bulkCreate(models);
  }

  async update(entity: CastMember): Promise<void> {
    const category = await this.findById(entity.cast_member_id);

    if (!category)
      throw new NotFoundError(entity.cast_member_id, this.getEntity());

    const modelToUpdate = CastMemberModelMapper.toModel(entity);
    await this.castMemberModel.update(modelToUpdate.toJSON(), {
      where: { cast_member_id: entity.cast_member_id.id },
    });
  }

  async delete(cast_member_id: Uuid): Promise<void> {
    const model = await this.findById(cast_member_id);

    if (!model) throw new NotFoundError(cast_member_id, this.getEntity());

    this.castMemberModel.destroy({
      where: {
        cast_member_id: cast_member_id.id,
      },
    });
  }

  async findById(entity_id: Uuid): Promise<CastMember | null> {
    const model = await this.castMemberModel.findByPk(entity_id.id);

    return model ? CastMemberModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<CastMember[]> {
    const models = await this.castMemberModel.findAll();
    return models.map((model) => CastMemberModelMapper.toEntity(model));
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.castMemberModel.sequelize.getDialect() as 'mysql';
    if (this.orderBy[dialect]?.[sort]) {
      return this.orderBy[dialect][sort](sort_dir);
    }
    return [[sort, sort_dir]];
  }

  getEntity(): new (...args: any[]) => CastMember {
    return CastMember;
  }
}
