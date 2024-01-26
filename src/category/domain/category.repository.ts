import { IRepository } from "src/shared/domain/repository/repository-interface";
import { Uuid } from "src/shared/domain/value-objects/uuid.vo";
import { Category } from "./category.entity";

export interface CategoryRepository extends IRepository<Category, Uuid> {
  
}