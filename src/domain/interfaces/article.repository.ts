// /src/domain/interfaces/IArticleRepository.ts

import { Article } from '../entities/article';

import { IRepository } from './repository';

export interface IArticleRepository extends IRepository<Article> {
  getArticlesByFeedId(feedId: number): Promise<Article[]>;

  getOneByLink(link: string): Promise<Article | null>;

  getUnanalyzedArticlesByAgent(agentName: string): Promise<Article[]>;

  deleteOldRSSArticles(olderThan: Date): Promise<void>;

  getByTag(tag: string): Promise<Article[]>;
}
