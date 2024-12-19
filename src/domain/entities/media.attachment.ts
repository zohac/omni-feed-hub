// src/domain/entities/media.attachment.ts

import { IEntity } from '../interfaces/entity';

export class MediaAttachment implements IEntity {
  constructor(
    public id: number | undefined,
    public url: string,
    public type?: string,
    public width?: number,
    public height?: number,
    public length?: number,
    public title?: string,
  ) {}
}
