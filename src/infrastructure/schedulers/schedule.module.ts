import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TaskExecutor } from '../../application/executor/task.executor';
import { CommandFactory } from '../../application/factories/command.factory';
import { TaskOrchestrator } from '../../application/orchestrators/task.orchestrator';
import { ParseFeedScheduler } from '../../application/scheduler/parse.feed.scheduler';
import { TaskScheduler } from '../../application/scheduler/task.scheduler';
import { AnalysisUseCases } from '../../application/usecases/analysis.use-cases';
import { ParseFeedUseCases } from '../../application/usecases/parse.feed.use-cases';
import { TaskUseCases } from '../../application/usecases/task.use-cases';
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
  providers: [
    TaskScheduler,
    ParseFeedScheduler,
    ParseFeedUseCases,
    AnalysisUseCases,
    TaskExecutor,
    TaskUseCases,
    TaskOrchestrator,
    CommandFactory,
  ],
  exports: [ParseFeedScheduler],
})
export class InfrastructureScheduleModule {}
