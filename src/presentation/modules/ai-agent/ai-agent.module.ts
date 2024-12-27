import { Module } from '@nestjs/common';

import { AssignActionToAgentDtoFactory } from '../../../application/factories/assign.action.to.agent.dto.factory';
import { AiAgentUseCases } from '../../../application/usecases/ai-agent.use-cases';
import { AssignActionsToAgentUseCases } from '../../../application/usecases/assign-actions-to-agent.use-cases';
import { InfrastructureModule } from '../../../infrastructure/modules/infrastructure.module';
import { ActionModule } from '../action/action.module';
import { ArticleCollectionModule } from '../article-collection/article.collection.module';

import { AiAgentController } from './ai-agent.controller';

@Module({
  imports: [
    InfrastructureModule,
    AiAgentModule,
    ActionModule,
    ArticleCollectionModule,
  ],
  controllers: [AiAgentController],
  providers: [
    AiAgentUseCases,
    AssignActionsToAgentUseCases,
    AssignActionToAgentDtoFactory,
  ],
  exports: [AiAgentUseCases],
})
export class AiAgentModule {}
