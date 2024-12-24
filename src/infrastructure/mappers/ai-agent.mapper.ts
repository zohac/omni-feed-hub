// src/infrastructure/mappers/AiAgentMapper.ts

import { AiAgent } from '../../domain/entities/ai-agent';
import { AiAgentProvider } from '../../domain/enums/ai-agent.provider';
import { AiAgentRole } from '../../domain/enums/ai-agent.role';
import { ActionEntity, AiAgentEntity } from '../entities';

import { ActionMapper } from './action.mapper';
import { AiConfigurationMapper } from './ai-configuration.mapper';

export class AiAgentMapper {
  static toDomain(entity: AiAgentEntity): AiAgent {
    const agent = new AiAgent(
      entity.id,
      entity.name,
      entity.description,
      entity.provider as AiAgentProvider,
      entity.role as AiAgentRole,
      AiConfigurationMapper.toDomain(entity.configuration),
    );

    if (undefined !== entity.actions && entity.actions.length > 0) {
      for (const action of entity.actions) {
        agent.addAction(ActionMapper.toDomain(action));
      }
    }

    return agent;
  }

  static toEntity(domain: AiAgent): AiAgentEntity {
    const actions: ActionEntity[] = [];
    if (undefined !== domain.actions) {
      for (const action of domain.actions) {
        actions.push(ActionMapper.toEntity(action));
      }
    }

    const entity = new AiAgentEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.provider = domain.provider;
    entity.role = domain.role;
    entity.configuration = AiConfigurationMapper.toEntity(domain.configuration);
    entity.actions = actions;

    return entity;
  }
}
