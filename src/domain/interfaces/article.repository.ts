// /src/domain/interfaces/IArticleRepository.ts

import { ArticleFilterDto } from 'src/application/dtos/article.filter.dto';

import { Article } from '../entities/article';

import { IRepository } from './repository';

export interface IArticleRepository extends IRepository<Article> {
  getArticlesByFeedId(feedId: number): Promise<Article[]>;

  getOneByLink(link: string): Promise<Article | null>;

  getUnanalyzedArticlesByAgent(agentName: string): Promise<Article[]>;

  deleteOldRSSArticles(olderThan: Date): Promise<void>;

  getByTag(params: ArticleFilterDto): Promise<Article[]>;

  getUnanalyzedArticlesByAgentWithTag(
    agentName: string,
    tag: string,
  ): Promise<Article[]>;

  getArticlesWithVideoTagToTranscript(): Promise<Article[]>;
}
