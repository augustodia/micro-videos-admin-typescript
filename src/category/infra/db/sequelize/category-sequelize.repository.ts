import { Op } from 'sequelize';
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: (keyof Category)[] = ['name', 'created_at'];

  constructor(private categoryModel: typeof CategoryModel) {}

  async search(props: CategorySearchParams ): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    const {rows: models, count} = await this.categoryModel.findAndCountAll(
      {
        ...(props.filter && {
          where: {
            name: {[Op.like]: `%${props.filter}%`}
          }
        }),
        ...(props.sort && this.sortableFields.includes(props.sort) 
        ? { orderBy: [[props.sort, props.sort_dir]]} 
        : { orderBy: [['created_at', 'desc']] }),
        offset,
        limit
      });

    return new CategorySearchResult({
      items: models.map(model => new Category({
        category_id: new Uuid(model.category_id),
        name: model.name,
        description: model.description,
        is_active: model.is_active,
        created_at: model.created_at
      })),
      per_page: props.per_page,
      current_page: props.page,
      total: count,
    });
  }

  async insert(entity: Category): Promise<void> {
    this.categoryModel.create({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at
    })
  }
  
  async bulkInsert(entities: Category[]): Promise<void> {
    this.categoryModel.bulkCreate(
      entities.map(entity => ({
        category_id: entity.category_id.id,
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at
      }))
    );
  }
  
  async update(entity: Category): Promise<void> {
    const model = await this.findById(entity.category_id);

    if (!model) throw new NotFoundError(entity.category_id, this.getEntity());

    this.categoryModel.update({
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at
    }, {
      where: {
        category_id: entity.category_id.id
      }
    });
  }
  
  async delete(category_id: Uuid): Promise<void> {
    const model = await this.findById(category_id);

    if (!model) throw new NotFoundError(category_id, this.getEntity());

    this.categoryModel.destroy({
      where: {
        category_id: category_id.id
      }
    });
  }
  
  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this.categoryModel.findByPk(entity_id.id);

    if (!model) return null;
    

    return new Category({
      category_id: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at
    });
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();

    return models.map(model => new Category({
      category_id: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at
    }));
  }
  
  getEntity(): new (...args: any[]) => Category {
    return Category;
  } 
}