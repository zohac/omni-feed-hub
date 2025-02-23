import { Module } from '@nestjs/common';

import { InfrastructureModule } from 'src/infrastructure/modules/infrastructure.module';
import { TaskExecutor } from '../../../application/executor/task.executor';
import { CommandFactory } from '../../../application/factories/command.factory';
import { TaskOrchestrator } from '../../../application/orchestrators/task.orchestrator';
import { AnalysisUseCases } from '../../../application/usecases/analysis.use-cases';
import { TaskUseCases } from '../../../application/usecases/task.use-cases';
import { ActionModule } from '../action/action.module';
import { AiAgentModule } from '../ai-agent/ai-agent.module';
import { ArticleModule } from '../article/article.module';
import { AnalysisController } from './analysis.controller';


@Module({
  imports: [InfrastructureModule, ArticleModule, AiAgentModule, ActionModule],
  controllers: [AnalysisController],
  providers: [AnalysisUseCases, TaskOrchestrator, TaskUseCases, TaskExecutor, CommandFactory],
  exports: [AnalysisUseCases],
})
export class AnalysisModule {}
