import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ParseFeedScheduler } from '../../application/scheduler/parse.feed.scheduler';
import { AnalysisUseCases } from '../../application/usecases/analysis.use-cases';
import { ParseFeedUseCases } from '../../application/usecases/parse.feed.use-cases';
import { AiAgentModule } from '../../presentation/modules/ai-agent/ai-agent.module';
import { ArticleModule } from '../../presentation/modules/article/article.module';
import { ArticleCollectionModule } from '../../presentation/modules/article-collection/article.collection.module';
import { RssFeedModule } from '../../presentation/modules/rss-feed/rss-feed.module';
import { RssFeedCollectionModule } from '../../presentation/modules/rss-feed-collection/rss-feed.collection.module';
import { InfrastructureModule } from '../modules/infrastructure.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Nécessaire pour activer les tâches planifiées
    InfrastructureModule, // Accès aux repositories et services communs
    RssFeedModule,
    RssFeedCollectionModule,
    ArticleModule,
    ArticleCollectionModule,
    AiAgentModule,
  ],
  providers: [ParseFeedScheduler, ParseFeedUseCases, AnalysisUseCases],
  exports: [ParseFeedScheduler],
})
export class InfrastructureScheduleModule {}
