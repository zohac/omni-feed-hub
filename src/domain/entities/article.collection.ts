// src/domain/entities/article.collection.ts

import { IBaseCollection } from '../interfaces/base.collection';

import { Article } from './Article';

export class ArticleCollection implements IBaseCollection {
  constructor(
    public id: number | undefined,
    public name: string,
    public description?: string,
    public articles?: Article[],
  ) {}
}
