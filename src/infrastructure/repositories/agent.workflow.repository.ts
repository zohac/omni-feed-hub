import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AgentWorkflow } from '../../domain/entities/agent.workflow';
import { IRepository } from '../../domain/interfaces/repository';
import { AgentWorkflowEntity } from '../entities';
import { AgentWorkflowMapper } from '../mappers/agent.workflow.mapper';

@Injectable()
export class AgentWorkflowRepository implements IRepository<AgentWorkflow> {
  constructor(
    @InjectRepository(AgentWorkflowEntity)
    private readonly repository: Repository<AgentWorkflowEntity>,
  ) {}

  async getOneById(id: number): Promise<AgentWorkflow | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    if (!entity) return null;

    return AgentWorkflowMapper.toDomain(entity);
  }

  async getAll(): Promise<AgentWorkflow[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => AgentWorkflowMapper.toDomain(entity));
  }

  async create(workflow: AgentWorkflow): Promise<AgentWorkflow> {
    const workflowEntity = AgentWorkflowMapper.toEntity(workflow);

    const entity = this.repository.create(workflowEntity);
    const result = await this.repository.save(entity);

    return AgentWorkflowMapper.toDomain(result);
  }

  async update(workflow: AgentWorkflow): Promise<AgentWorkflow | null> {
    const workflowEntity = AgentWorkflowMapper.toEntity(workflow);

    await this.repository.update(workflowEntity.id, workflowEntity);

    return await this.getOneById(workflowEntity.id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
