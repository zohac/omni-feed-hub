import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ParseFeedScheduler } from '../../application/scheduler/parse.feed.scheduler';
import { ParseFeedUseCase } from '../../application/usecases/parse.feed.use-case';
import { RssFeedCollectionUseCases } from '../../application/usecases/rss-feed.collection.use-cases';
import { RssFeedUseCases } from '../../application/usecases/rss-feed.use-cases';
import { InfrastructureModule } from '../infrastructure.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Nécessaire pour activer les tâches planifiées
    InfrastructureModule, // Accès aux repositories et services communs
  ],
  providers: [
    ParseFeedScheduler,
    ParseFeedUseCase,
    RssFeedUseCases,
    RssFeedCollectionUseCases,
  ],
  exports: [ParseFeedScheduler],
})
export class InfrastructureScheduleModule {}
