// src/domain/entities/post.ts

import { IEntity } from '../interfaces/entity';

import { Article } from './article';
import { MediaAttachment } from './media.attachment';

export class Post implements IEntity {
  constructor(
    public id: number | undefined,
    public title: string,
    public content: string,
    public originalContent: string,
    public recommendation: string,
    public explanation: string,
    public createdAt: Date | null,
    public scheduledAt: Date | null,
    public publishedAt: Date | null,
    public published: boolean,
    public attachments: MediaAttachment[] = [],
    public articles?: Article[],
  ) {}
}
