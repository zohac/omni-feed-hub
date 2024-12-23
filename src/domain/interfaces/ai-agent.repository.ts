// /src/domain/interfaces/ai-agent.repository.ts

import { AiAgent } from '../entities/ai-agent';

import { IRepository } from './repository';

export interface IAiAgentRepository extends IRepository<AiAgent> {
  getAllAnalysisAgent(): Promise<AiAgent[]>;
}
