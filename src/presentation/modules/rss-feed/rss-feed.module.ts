// src/presentation/rss-feed/rss-feed.module.ts

import { Module } from '@nestjs/common';

import { AnalysisUseCases } from '../../../application/usecases/analysis.use-cases';
import { ParseFeedUseCases } from '../../../application/usecases/parse.feed.use-cases';
import { RssFeedUseCases } from '../../../application/usecases/rss-feed.use-cases';
import { InfrastructureModule } from '../../../infrastructure/modules/infrastructure.module';
import { AiAgentModule } from '../ai-agent/ai-agent.module';
import { ArticleModule } from '../article/article.module';
import { ArticleCollectionModule } from '../article-collection/article.collection.module';
import { RssFeedCollectionModule } from '../rss-feed-collection/rss-feed.collection.module';

import { RssFeedController } from './rss-feed.controller';

@Module({
  imports: [
    InfrastructureModule,
    RssFeedCollectionModule,
    ArticleModule,
    ArticleCollectionModule,
    AiAgentModule,
  ],
  controllers: [RssFeedController],
  providers: [RssFeedUseCases, ParseFeedUseCases, AnalysisUseCases],
  exports: [RssFeedUseCases],
})
export class RssFeedModule {}
