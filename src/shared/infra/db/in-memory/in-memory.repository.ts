import { Entity } from "src/shared/domain/entity";
import { NotFoundError } from "src/shared/domain/errors/not-found.error";
import { IRepository } from "src/shared/domain/repository/repository-interface";
import { ValueObject } from "src/shared/domain/value-object";

export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject> implements IRepository<E, EntityId> {
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }
  
  async update(entity: E): Promise<void> {
    const indexItem = this.items.findIndex(item => item.entity_id.equals(entity.entity_id));
    
    if(indexItem === -1) 
      throw new NotFoundError(entity.entity_id, this.getEntity())

    this.items[indexItem] = entity;
  }
  
  async delete(entity_id: EntityId): Promise<void> {
    const indexItem = this.items.findIndex(item => item.entity_id.equals(entity_id));

    if(indexItem === -1) 
      throw new NotFoundError(entity_id, this.getEntity())

    this.items.splice(indexItem, 1);
  }
  
  async findById(entity_id: EntityId): Promise<E | null> {
    const item = this.items.find(item => item.entity_id.equals(entity_id));

    return typeof item === 'undefined' ? null : item;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }
  
  abstract getEntity(): new (...args: any[]) => E;

}