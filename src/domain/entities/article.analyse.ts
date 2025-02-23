// src/domain/entities/article.analysis.ts

import { ArticleAnalysisStatus } from '../enums/article.analysis.status';

import { Article } from './article';

export class ArticleAnalysis {
  constructor(
    public id: number | undefined,
    public article: Article,
    public agent: string,
    public status: ArticleAnalysisStatus,
    public createdAt: Date,
    public result?: string,
  ) {}
}
