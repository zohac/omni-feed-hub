// src/domain/entities/tag.ts

import { IEntity } from '../interfaces/entity';

export class Tag implements IEntity {
  constructor(
    public id: number | undefined,
    public name: string,
  ) {}
}
