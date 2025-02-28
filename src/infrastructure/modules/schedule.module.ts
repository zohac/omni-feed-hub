import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TaskExecutor } from 'src/application/executor/task.executor';
import { CommandFactory } from 'src/application/factories/command.factory';
import { TaskOrchestrator } from 'src/application/orchestrators/task.orchestrator';
import { DeleteOldArticlesScheduler } from 'src/application/scheduler/delete.old.articles.scheduler';
import { ParseFeedScheduler } from 'src/application/scheduler/parse.feed.scheduler';
import { TaskScheduler } from 'src/application/scheduler/task.scheduler';
import { AnalysisUseCases } from 'src/application/usecases/analysis.use-cases';
import { ParseFeedUseCases } from 'src/application/usecases/parse.feed.use-cases';
import { TaskUseCases } from 'src/application/usecases/task.use-cases';
import { AiAgentModule } from 'src/presentation/modules/ai-agent/ai-agent.module';
import { ArticleCollectionModule } from 'src/presentation/modules/article-collection/article.collection.module';
import { ArticleModule } from 'src/presentation/modules/article/article.module';
import { RssFeedCollectionModule } from 'src/presentation/modules/rss-feed-collection/rss-feed.collection.module';
import { RssFeedModule } from 'src/presentation/modules/rss-feed/rss-feed.module';

import { InfrastructureModule } from './infrastructure.module';

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
  providers: [
    TaskScheduler,
    ParseFeedScheduler,
    ParseFeedUseCases,
    AnalysisUseCases,
    TaskExecutor,
    TaskUseCases,
    TaskOrchestrator,
    CommandFactory,
    DeleteOldArticlesScheduler,
  ],
  exports: [ParseFeedScheduler],
})
export class InfrastructureScheduleModule {}
