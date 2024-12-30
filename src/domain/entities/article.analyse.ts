// src/domain/entities/article.analysis.ts

import { ArticleAnalysisStatus } from '../enums/article.analysis.status';

import { AiAgent } from './ai-agent';
import { Article } from './article';

export class ArticleAnalysis {
  constructor(
    public id: number | undefined,
    public article: Article,
    public agent: AiAgent,
    public status: ArticleAnalysisStatus,
    public result: string,
    public createdAt: Date,
  ) {}
}
