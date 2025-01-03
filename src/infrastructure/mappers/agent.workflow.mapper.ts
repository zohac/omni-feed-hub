import { AgentWorkflow } from '../../domain/entities/agent.workflow';
import { AgentWorkflowEntity, AgentWorkflowStepEntity } from '../entities';

import { AgentWorkflowStepStepMapper } from './agent.workflow.step.mapper';

export class AgentWorkflowMapper {
  static toDomain(entity: AgentWorkflowEntity): AgentWorkflow {
    return this.toPartialDomain(entity);
  }

  static toPartialDomain(entity: AgentWorkflowEntity): AgentWorkflow {
    const steps = entity.steps.map((step: AgentWorkflowStepEntity) => {
      return AgentWorkflowStepStepMapper.toPartialDomain(step);
    });

    return new AgentWorkflow(entity.id, entity.name, entity.status, steps);
  }

  static toEntity(domain: AgentWorkflow): AgentWorkflowEntity {
    return this.toPartialEntity(domain);
  }

  static toPartialEntity(domain: AgentWorkflow): AgentWorkflowEntity {
    const entity = new AgentWorkflowEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;
    entity.status = domain.status;

    entity.steps = entity.steps.map((step: AgentWorkflowStepEntity) => {
      return AgentWorkflowStepStepMapper.toPartialEntity(step);
    });

    return entity;
  }
}
