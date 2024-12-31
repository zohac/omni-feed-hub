// src/infrastructure/modules/infrastructure.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestLoggerAdapter } from '../adapters/nest-logger.adapter';
import {
  ActionEntity,
  AiAgentEntity,
  ArticleAnalysisEntity,
  ArticleCollectionEntity,
  ArticleEntity,
  RssFeedCollectionEntity,
  RssFeedEntity,
  TaskEntity,
} from '../entities';
import { AiServiceFactory } from '../factories/ai-service.factory';
import { ActionRepository } from '../repositories/action.repository';
import { AiAgentRepository } from '../repositories/ai-agent.repository';
import { ArticleAnalysisRepository } from '../repositories/article.analysis.repository';
import { ArticleCollectionRepository } from '../repositories/article.collection.repository';
import { ArticleRepository } from '../repositories/article.repository';
import { RssFeedCollectionRepository } from '../repositories/rss-feed.collection.repository';
import { RssFeedRepository } from '../repositories/rss-feed.repository';
import { TaskRepository } from '../repositories/task.repository';
import { RssParserService } from '../services/rss-parser.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      RssFeedEntity,
      RssFeedCollectionEntity,
      ArticleCollectionEntity,
      AiAgentEntity,
      TaskEntity,
      ActionEntity,
      ActionEntity,
      ArticleAnalysisEntity,
    ]),
  ],
  providers: [
    {
      provide: 'IRssParser',
      useClass: RssParserService,
    },
    {
      provide: 'ILogger',
      useClass: NestLoggerAdapter,
    },
    {
      provide: 'IRepository<Article>',
      useClass: ArticleRepository,
    },
    {
      provide: 'IRepository<ArticleCollection>',
      useClass: ArticleCollectionRepository,
    },
    {
      provide: 'IRepository<RssFeed>',
      useClass: RssFeedRepository,
    },
    {
      provide: 'IRepository<RssFeedCollection>',
      useClass: RssFeedCollectionRepository,
    },
    {
      provide: 'IRepository<AiAgent>',
      useClass: AiAgentRepository,
    },
    {
      provide: 'IRepository<Task>',
      useClass: TaskRepository,
    },
    {
      provide: 'IRepository<Action>',
      useClass: ActionRepository,
    },
    {
      provide: 'IRepository<ArticleAnalysis>',
      useClass: ArticleAnalysisRepository,
    },
    {
      provide: 'IAiServiceFactory',
      useClass: AiServiceFactory,
    },
  ],
  exports: [
    TypeOrmModule,
    'IRssParser',
    'ILogger',
    'IRepository<Article>',
    'IRepository<RssFeed>',
    'IRepository<RssFeedCollection>',
    'IRepository<ArticleCollection>',
    'IRepository<AiAgent>',
    'IRepository<Task>',
    'IRepository<Action>',
    'IRepository<ArticleAnalysis>',
    'IAiServiceFactory',
  ],
})
export class InfrastructureModule {}
