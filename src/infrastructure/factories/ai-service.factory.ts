// src/infrastructure/factories/AIServiceFactory.ts

import { AiAgentProvider } from '../../domain/enums/ai-agent.provider';
import { IAiService } from '../../domain/interfaces/ai-service';
import { IAiServiceFactory } from '../../domain/interfaces/ai-service.factory';
import { config } from '../config/ai.config';
import { OllamaService } from '../integrations/ollama.service';

export class AiServiceFactory implements IAiServiceFactory {
  create(provider: AiAgentProvider): IAiService {
    switch (provider) {
      case 'ollama':
        return new OllamaService(config.ollama.baseUrl);
      // Ajoutez d'autres cas pour d'autres fournisseurs
      default:
        throw new Error(`Fournisseur IA non supporté: ${provider}`);
    }
  }
}
