// src/domain/interfaces/IAIService.ts

import { AiAgent } from '../entities/ai-agent';
import { AiServiceAnalysisResponse } from '../entities/ai-service.analysis.response';
import { Article } from '../entities/article';

export interface IAiService {
  analyzeArticle(
    agent: AiAgent,
    article: Article,
  ): Promise<AiServiceAnalysisResponse>;

  generateContent(agent: AiAgent, article: Article): Promise<string>;
}
