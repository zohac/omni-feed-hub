import { Module } from '@nestjs/common';

import { AiAgentUseCases } from '../../../application/usecases/ai-agent.use-cases';
import { InfrastructureModule } from '../../../infrastructure/modules/infrastructure.module';

import { AiAgentController } from './ai-agent.controller';

@Module({
  imports: [InfrastructureModule],
  controllers: [AiAgentController],
  providers: [AiAgentUseCases],
  exports: [AiAgentUseCases],
})
export class AiAgentModule {}
