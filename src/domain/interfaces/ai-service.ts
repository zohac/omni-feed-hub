// src/domain/interfaces/IAIService.ts

import { AiAgent } from '../entities/ai-agent';
import { Article } from '../entities/article';

export interface IAiService {
  analyzeArticle(agent: AiAgent, article: Article): Promise<boolean>;

  generateContent(agent: AiAgent, article: Article): Promise<string>;
}
