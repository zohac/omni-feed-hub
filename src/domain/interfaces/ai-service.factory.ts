// src/domain/interfaces/IAIServiceFactory.ts

import { AiAgentProvider } from '../enums/ai-agent.provider';

import { IAiService } from './ai-service';

export interface IAiServiceFactory {
  create(provider: AiAgentProvider): IAiService;
}
