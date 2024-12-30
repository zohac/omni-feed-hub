// src/infrastructure/mappers/TaskMapper.ts

import { Task } from '../../domain/entities/task';
import { TaskEntity } from '../entities';

import { AiAgentMapper } from './ai-agent.mapper';
import { ArticleMapper } from './article.mapper';

export class TaskMapper {
  static toDomain(entity: TaskEntity): Task {
    const domain = this.toPartialDomain(entity);

    domain.assignedAgent = AiAgentMapper.toDomain(entity.assignedAgent);

    return domain;
  }

  static toPartialDomain(entity: TaskEntity): Task {
    return new Task(
      entity.id,
      entity.name,
      entity.type,
      entity.mode,
      entity.payload,
      entity.status,
      entity.createdAt,
      ArticleMapper.toPartialDomain(entity.article),
    );
  }

  static toEntity(domain: Task): TaskEntity {
    const entity = this.toPartialEntity(domain);

    entity.assignedAgent = AiAgentMapper.toEntity(domain.assignedAgent);

    return entity;
  }

  static toPartialEntity(domain: Task): TaskEntity {
    const entity = new TaskEntity();
    if (undefined !== domain.id) entity.id = domain.id;
    entity.name = domain.name;
    entity.type = domain.type;
    entity.mode = domain.mode;
    entity.payload = domain.payload;
    entity.status = domain.status;
    entity.createdAt = domain.createdAt;
    entity.article = ArticleMapper.toPartialEntity(domain.article);

    return entity;
  }
}
