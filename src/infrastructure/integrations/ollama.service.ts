// src/infrastructure/integrations/ollama.service.ts

import { Injectable } from '@nestjs/common';

import { AiAgent } from '../../domain/entities/ai-agent';
import { Article } from '../../domain/entities/Article';
import { IAiService } from '../../domain/interfaces/ai-service';
import { StringUtils } from '../../utils/string.utils';

@Injectable()
export class OllamaService implements IAiService {
  constructor(private readonly baseUrl: string) {}

  async analyzeArticle(agent: AiAgent, article: Article): Promise<boolean> {
    const prompt = StringUtils.replacePlaceholders(agent.configuration.prompt, {
      title: article.title ?? '',
      description: article.description ?? '',
    });

    const body = JSON.stringify({
      model: agent.configuration.model,
      prompt: prompt,
      stream: agent.configuration.stream ?? false,
      options: {
        temperature: agent.configuration.temperature ?? 0.7,
      },
    });

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (!response.ok) {
      // logger.error(`Ollama responded with status ${response.status}`);
      throw new Error(`Ollama responded with status ${response.status}`);
    }

    const data = await response.json();
    const result = data.response.toLowerCase().trim();

    return result === 'true';
  }

  async generateContent(agent: AiAgent, article: Article): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        // ...
      },
      body: JSON.stringify({
        model: agent.configuration.model || 'text-davinci-003',
        prompt: agent.configuration.prompt.replace(
          '{text}',
          article.description ?? '',
        ),
        max_tokens: 500,
      }),
    });

    // Traitement du résultat pour extraire le contenu généré
    const result = await response.json();
    return result.choices[0].text;
  }
}