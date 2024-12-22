// src/usecases/AgentAIUseCases.ts

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { AiAgent } from '../../domain/entities/ai-agent';
import { AiConfiguration } from '../../domain/entities/ai-configuration';
import { IRepository } from '../../domain/interfaces/repository';
import { IUsecase } from '../../domain/interfaces/usecase';
import { CreateAiAgentDto, UpdateAiAgentDto } from '../dtos/ai-agent.dto';

@Injectable()
export class AiAgentUseCases
  implements IUsecase<AiAgent, CreateAiAgentDto, UpdateAiAgentDto>
{
  constructor(
    @Inject('IRepository<AiAgent>')
    private readonly repository: IRepository<AiAgent>,
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

    if (undefined !== aiAgentDTO?.name) {
      aiAgent.name = aiAgentDTO.name;
    }

    if (undefined !== aiAgentDTO?.description) {
      aiAgent.description = aiAgentDTO.description;
    }

    if (undefined !== aiAgentDTO?.provider) {
      aiAgent.provider = aiAgentDTO.provider;
    }

    if (undefined !== aiAgentDTO?.role) {
      aiAgent.role = aiAgentDTO.role;
    }

    if (undefined !== aiAgentDTO?.configuration) {
      if (undefined !== aiAgentDTO.configuration.model)
        aiAgent.configuration.model = aiAgentDTO.configuration.model;

      if (undefined !== aiAgentDTO.configuration.prompt)
        aiAgent.configuration.prompt = aiAgentDTO.configuration.prompt;

      if (undefined !== aiAgentDTO.configuration.stream)
        aiAgent.configuration.stream = aiAgentDTO.configuration.stream;

      if (undefined !== aiAgentDTO.configuration.temperature)
        aiAgent.configuration.temperature =
          aiAgentDTO.configuration.temperature;
    }

    return await this.repository.update(aiAgent);
  }

  async delete(id: number): Promise<void> {
    const agent = await this.getOneById(id);

    await this.repository.delete(agent.id);
  }
}
