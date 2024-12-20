// src/domain/entities/article.ts

import { IEntity } from '../interfaces/entity';

import { ArticleCollection } from './article.collection';
import { MediaAttachment } from './media.attachment';
import { RssFeed } from './rss-feed';

export enum ArticleSourceType {
  MANUAL = 'manual',
  RSS = 'rss',
}

export interface ArticleState {
  isRead: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  isSaved: boolean;
}

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
  ) {}
}
