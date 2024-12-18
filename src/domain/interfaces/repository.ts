// /src/domain/interfaces/repository.ts

import { IEntity } from './entity';

export interface IRepository<T extends IEntity> {
  getOneById(id: number): Promise<T | null>;

  getAll(): Promise<T[]>;

  create(entity: T): Promise<T>;

  update(entity: T): Promise<T | null>;

  delete(id: number): Promise<void>;
}
