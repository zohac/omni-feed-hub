import { Repository } from 'typeorm';

import { AiAgentProvider } from '../../src/domain/enums/ai-agent.provider';
import { AiAgentRole } from '../../src/domain/enums/ai-agent.role';
import { AiAgentEntity } from '../../src/infrastructure/entities';

export const createAiAgentFixtures = async (
  repository: Repository<AiAgentEntity>,
) => {
  const agents = [
    {
      id: undefined,
      name: 'AI Agent 1',
      description: 'Un super Agent',
      provider: AiAgentProvider.OLLAMA,
      role: AiAgentRole.ANALYSIS,
      configuration: {
        model: 'llama3.1',
        prompt: "Un super prompt pour l'agent IA 1.",
        stream: false,
        temperature: 0.7,
      },
    },
    {
      id: undefined,
      name: 'AI Agent 2',
      description: 'Un super Agent',
      provider: AiAgentProvider.OLLAMA,
      role: AiAgentRole.ANALYSIS,
      configuration: {
        model: 'llama2',
        prompt: "Un super prompt pour l'agent IA 2.",
        stream: false,
      },
    },
  ];
  return await repository.save(agents.map((data) => repository.create(data)));
};
