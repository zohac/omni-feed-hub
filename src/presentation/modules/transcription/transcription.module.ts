import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { TranscriptionUseCases } from 'src/application/usecases/transcription.use-cases';
import { InfrastructureModule } from 'src/infrastructure/modules/infrastructure.module';
import { BullQueueService } from 'src/infrastructure/queues/bull.queue.service';
import { ArticleModule } from '../article/article.module';

import { TranscriptionController } from './transcription.controller';
import { TranscriptionProcessor } from './transcription.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transcription',
      redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    }),
    InfrastructureModule,
    ArticleModule,
  ],
  controllers: [TranscriptionController],
  providers: [
    TranscriptionProcessor,
    TranscriptionUseCases,
    {
      provide: 'IQueueService',
      useClass: BullQueueService,
    },
  ],
  exports: ['IQueueService', TranscriptionUseCases, TranscriptionProcessor],
})
export class TranscriptionModule {}
