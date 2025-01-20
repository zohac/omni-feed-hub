// src/infrastructure/repositories/AgentAIRepository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AiAgent } from '../../domain/entities/ai-agent';
import { AiAgentRole } from '../../domain/enums/ai-agent.role';
import { IAiAgentRepository } from '../../domain/interfaces/ai-agent.repository';
import { AiAgentEntity } from '../entities';
import { AiAgentMapper } from '../mappers/ai-agent.mapper';

@Injectable()
export class AiAgentRepository implements IAiAgentRepository {
  constructor(
    @InjectRepository(AiAgentEntity)
    private readonly repository: Repository<AiAgentEntity>,
  ) {}

  async getAll(): Promise<AiAgent[]> {
    const entities = await this.repository.find({
      relations: ['configuration'],
    });

    return entities.map((entity) => AiAgentMapper.toDomain(entity));
  }

  async getAllAnalysisAgent(): Promise<AiAgent[]> {
    const entities = await this.repository.find({
      where: { role: AiAgentRole.ANALYSIS },
    });
    return entities.map((entity) => AiAgentMapper.toDomain(entity));
  }

  async getOneById(id: number): Promise<AiAgent | null> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;

    return AiAgentMapper.toDomain(entity);
  }

  async create(aiAgent: AiAgent): Promise<AiAgent> {
    const aiAgentEntity = AiAgentMapper.toEntity(aiAgent);
    const entity = this.repository.create(aiAgentEntity);
    const result = await this.repository.save(entity);

    return await this.getOneById(result.id);
  }

  async update(aiAgent: AiAgent): Promise<AiAgent> {
    const aiAgentEntity = AiAgentMapper.toEntity(aiAgent);
    const result = await this.repository.save(aiAgentEntity);

    return AiAgentMapper.toDomain(result);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }
}
