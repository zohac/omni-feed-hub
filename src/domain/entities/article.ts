// src/domain/entities/article.ts

import { ArticleSourceType } from '../enums/article.source.type';
import { ArticleState } from '../interfaces/article.state';
import { IEntity } from '../interfaces/entity';

import { ArticleCollection } from './article.collection';
import { MediaAttachment } from './media.attachment';
import { RssFeed } from './rss-feed';
import { Task } from './task';

export class Article implements IEntity {
  constructor(
    public id: number | undefined,
    public title: string,
    public createdAt: Date,
    public updatedAt: Date,
    public publicationAt: Date,
    public sourceType: ArticleSourceType,
    public state: ArticleState,
    public feed?: RssFeed,
    public link?: string,
    public description?: string,
    public content?: string,
    public tags?: { id: string; label: string }[],
    public mediaAttachments?: MediaAttachment[], // Fichiers multimédias
    public metadata?: Record<string, string>, // GUID, auteur, etc.
    public collection?: ArticleCollection,
    public tasks?: Task[],
  ) {}
}
