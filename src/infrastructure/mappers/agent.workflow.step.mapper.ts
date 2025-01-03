import { AgentWorkflowStep } from '../../domain/entities/agent.workflow.step';
import { AgentWorkflowStepEntity } from '../entities';

import { AgentWorkflowMapper } from './agent.workflow.mapper';

export class AgentWorkflowStepStepMapper {
  static toDomain(entity: AgentWorkflowStepEntity): AgentWorkflowStep {
    const domain = this.toPartialDomain(entity);

    domain.workflow = AgentWorkflowMapper.toPartialDomain(entity.workflow);

    return domain;
  }

  static toPartialDomain(entity: AgentWorkflowStepEntity): AgentWorkflowStep {
    return new AgentWorkflowStep(
      entity.id,
      entity.stepType,
      entity.agentId,
      entity.status,
      entity.inputData,
      entity.outputData,
    );
  }

  static toEntity(domain: AgentWorkflowStep): AgentWorkflowStepEntity {
    const entity = this.toPartialEntity(domain);

    entity.workflow = AgentWorkflowMapper.toPartialEntity(domain.workflow);

    return entity;
  }

  static toPartialEntity(domain: AgentWorkflowStep): AgentWorkflowStepEntity {
    const entity = new AgentWorkflowStepEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.stepType = domain.stepType;
    entity.agentId = domain.agentId;
    entity.status = domain.status;
    entity.inputData = domain.inputData;
    entity.outputData = domain.outputData;

    return entity;
  }
}
