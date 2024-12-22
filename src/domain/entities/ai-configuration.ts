// src/domain/entities/ai-configuration.ts

import { IEntity } from '../interfaces/entity';

export class AiConfiguration implements IEntity {
  constructor(
    public id: number | undefined,
    public model: string,
    public prompt: string,
    public stream: boolean,
    public temperature?: number,
  ) {}
}
