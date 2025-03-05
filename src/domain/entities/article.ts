// src/domain/entities/article.ts

import { ArticleSourceType } from '../enums/article.source.type';
import { ArticleState } from '../interfaces/article.state';
import { IEntity } from '../interfaces/entity';

import { ArticleCollection } from './article.collection';
import { MediaAttachment } from './media.attachment';
import { Post } from './post';
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
    public tags?: string[],
    public mediaAttachments?: MediaAttachment[], // Fichiers multimédias
    public metadata?: Record<string, string>, // GUID, auteur, etc.
    public collection?: ArticleCollection,
    public tasks?: Task[],
    public post?: Post,
  ) {}

  addTag(tag: string) {
    if (this.tags && !this.tags.includes(tag)) {
      this.tags.push(tag);
    } else {
      this.tags = [tag];
    }
  }

  removeTag(tag: string): void {
    if (this.tags) {
      const index = this.tags.indexOf(tag);
      if (index !== -1) {
        this.tags.splice(index, 1);
      }
    }
  }
}
