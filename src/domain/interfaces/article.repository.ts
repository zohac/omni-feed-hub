// /src/domain/interfaces/IArticleRepository.ts

import { Article } from '../entities/article';

import { IRepository } from './repository';

export interface IArticleRepository extends IRepository<Article> {
  getArticlesByFeedId(feedId: number): Promise<Article[]>;

  getOneByLink(link: string): Promise<Article | null>;

  getUnanalyzedArticlesByAgent(agentId: number): Promise<Article[]>;

  deleteOldRSSArticles(olderThan: Date): Promise<void>;
}
