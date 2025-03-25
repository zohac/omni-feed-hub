// src/infrastructure/modules/infrastructure.module.ts

import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestLoggerAdapter } from '../adapters/nest-logger.adapter';
import {
  ActionEntity,
  AiAgentEntity,
  ArticleAnalysisEntity,
  ArticleCollectionEntity,
  ArticleEntity,
  PostEntity,
  RssFeedCollectionEntity,
  RssFeedEntity,
  RssFeedStatsEntity,
  TaskEntity,
} from '../entities';
import { AiServiceFactory } from '../factories/ai-service.factory';
import { BullQueueService } from '../queues/bull.queue.service';
import { ActionRepository } from '../repositories/action.repository';
import { AiAgentRepository } from '../repositories/ai-agent.repository';
import { ArticleAnalysisRepository } from '../repositories/article.analysis.repository';
import { ArticleCollectionRepository } from '../repositories/article.collection.repository';
import { ArticleRepository } from '../repositories/article.repository';
import { PostRepository } from '../repositories/post.repository';
import { RssFeedCollectionRepository } from '../repositories/rss-feed.collection.repository';
import { RssFeedRepository } from '../repositories/rss-feed.repository';
import { RssFeedStatsRepository } from '../repositories/rss-feed.stats.repository';
import { TaskRepository } from '../repositories/task.repository';
import { HtmlToMdService } from '../services/html-to-md.service';
import { RssParserService } from '../services/rss-parser.service';
import { WebScraperService } from '../services/web-scraper.service';
import { Yt2docService } from '../services/yt2doc.service';

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
      PostEntity,
      RssFeedStatsEntity,
    ]),
    BullModule.registerQueue({
      name: 'transcription',
    }),
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
      provide: 'IRepository<Post>',
      useClass: PostRepository,
    },
    {
      provide: 'IRepository<RssFeedStats>',
      useClass: RssFeedStatsRepository,
    },
    {
      provide: 'IAiServiceFactory',
      useClass: AiServiceFactory,
    },
    {
      provide: 'IWebScraper',
      useClass: WebScraperService,
    },
    {
      provide: 'ITranscribeVideo',
      useClass: Yt2docService,
    },
    BullQueueService,
    HtmlToMdService,
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
    'IRepository<Post>',
    'IRepository<RssFeedStats>',
    'IAiServiceFactory',
    'IWebScraper',
    'ITranscribeVideo',
    BullQueueService,
    HtmlToMdService,
  ],
})
export class InfrastructureModule {}
