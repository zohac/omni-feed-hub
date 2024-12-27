// src/usecases/ai-agent.use-cases.ts

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { AiAgent } from '../../domain/entities/ai-agent';
import { AiConfiguration } from '../../domain/entities/ai-configuration';
import { IAiAgentRepository } from '../../domain/interfaces/ai-agent.repository';
import { IUsecase } from '../../domain/interfaces/usecase';
import { CreateAiAgentDto, UpdateAiAgentDto } from '../dtos/ai-agent.dto';

import { ActionUseCases } from './action.use-cases';

@Injectable()
export class AiAgentUseCases
  implements IUsecase<AiAgent, CreateAiAgentDto, UpdateAiAgentDto>
{
  constructor(
    @Inject('IRepository<AiAgent>')
    private readonly repository: IAiAgentRepository,
    private readonly actionUseCase: ActionUseCases,
  ) {}

  async getAll(): Promise<AiAgent[]> {
    return await this.repository.getAll();
  }

  async getOneById(id: number): Promise<AiAgent | null> {
    const agent = await this.repository.getOneById(id);
    if (!agent) {
      throw new HttpException('AI Agent not found.', HttpStatus.NOT_FOUND);
    }

    return await this.repository.getOneById(id);
  }

  async create(aiAgentDTO: CreateAiAgentDto): Promise<AiAgent> {
    const configuration = new AiConfiguration(
      undefined,
      aiAgentDTO.configuration.model,
      aiAgentDTO.configuration.prompt,
      aiAgentDTO.configuration.stream,
      aiAgentDTO.configuration.temperature,
    );

    const aiAgent = new AiAgent(
      undefined,
      aiAgentDTO.name,
      aiAgentDTO.description,
      aiAgentDTO.provider,
      aiAgentDTO.role,
      configuration,
    );

    return await this.repository.create(aiAgent);
  }

  async update(id: number, aiAgentDTO: UpdateAiAgentDto): Promise<AiAgent> {
    const aiAgent = await this.getOneById(id);

    this.updateAgentFields(aiAgent, aiAgentDTO);
    this.updateAgentConfiguration(aiAgent, aiAgentDTO.configuration);

    if (aiAgentDTO.actionIds) {
      await this.updateAgentActions(aiAgent, aiAgentDTO.actionIds);
    }

    return this.repository.update(aiAgent);
  }

  // Mise à jour des champs de base (nom, description, rôle, provider)
  private updateAgentFields(agent: AiAgent, dto: UpdateAiAgentDto): void {
    const fields = ['name', 'description', 'provider', 'role'];

    for (const field of fields) {
      if (dto[field] !== undefined) {
        agent[field] = dto[field];
      }
    }
  }

  // Mise à jour de la configuration IA
  private updateAgentConfiguration(
    agent: AiAgent,
    config?: Partial<AiConfiguration>,
  ): void {
    if (!config) return;

    const configFields = ['model', 'prompt', 'stream', 'temperature'];

    for (const field of configFields) {
      if (config[field] !== undefined) {
        agent.configuration[field] = config[field];
      }
    }
  }

  // Mise à jour des actions (en parallèle avec Promise.all)
  private async updateAgentActions(
    agent: AiAgent,
    actionIds: number[],
  ): Promise<void> {
    const actions = await Promise.all(
      actionIds.map((id) => this.actionUseCase.getOneById(id)),
    );

    actions.forEach((action) => {
      agent.addAction(action);
    });
  }

  async delete(id: number): Promise<void> {
    const agent = await this.getOneById(id);

    await this.repository.delete(agent.id);
  }

  async getAllAnalysisAgent(): Promise<AiAgent[]> {
    return await this.repository.getAllAnalysisAgent();
  }
}
