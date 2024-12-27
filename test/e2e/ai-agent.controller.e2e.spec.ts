// tests/e2e/RSSFeedController.e2e.test.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { CreateAiAgentDto } from '../../src/application/dtos/ai-agent.dto';
import { AiAgentProvider } from '../../src/domain/enums/ai-agent.provider';
import { AiAgentRole } from '../../src/domain/enums/ai-agent.role';
import {
  ActionEntity,
  AiAgentEntity,
  ArticleCollectionEntity,
} from '../../src/infrastructure/entities';
import { AppModule } from '../../src/presentation/modules/app.module';
import { createActionFixtures } from '../fixtures/action.fixtures';
import { createAiAgentFixtures } from '../fixtures/ai-agent.fixtures';
import { createArticleCollectionFixture } from '../fixtures/article.collection.fixtures';

describe('AIAgentController E2E Tests', () => {
  let repository: Repository<AiAgentEntity>;
  let actionRepository: Repository<ActionEntity>;
  let collectionRepository: Repository<ArticleCollectionEntity>;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    // Récupérer le repository TypeORM pour RssFeedEntity
    repository = moduleFixture.get<Repository<AiAgentEntity>>(
      getRepositoryToken(AiAgentEntity),
    );
    actionRepository = moduleFixture.get<Repository<ActionEntity>>(
      getRepositoryToken(ActionEntity),
    );
    collectionRepository = moduleFixture.get<
      Repository<ArticleCollectionEntity>
    >(getRepositoryToken(ArticleCollectionEntity));

    // Nettoyer la table avant chaque test (important en E2E)
    await repository.clear();
    await actionRepository.clear();
    await collectionRepository.clear();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/agents', () => {
    it('should return all AI Agent', async () => {
      await createAiAgentFixtures(repository);

      const response = await request(app.getHttpServer()).get('/agents');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name', 'AI Agent 1');
      expect(response.body[1]).toHaveProperty('name', 'AI Agent 2');
    });

    it('should return an empty array if no collections exist', async () => {
      const response = await request(app.getHttpServer()).get('/agents');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/agents/:id', () => {
    it('should return a ai agent by ID', async () => {
      const [agent] = await createAiAgentFixtures(repository);

      const response = await request(app.getHttpServer()).get(
        `/agents/${agent.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'AI Agent 1');
    });

    it('should return 404 if ai agent not found', async () => {
      const agents = [];
      agents.push(await createAiAgentFixtures(repository));

      const response = await request(app.getHttpServer()).get('/agents/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'AI Agent not found.');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/agents/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'ID must be a positive integer',
      );
      expect(response.body).toHaveProperty('error', 'Bad Request');
    });
  });

  describe('POST /api/agents', () => {
    it('should create a new action', async () => {
      const aiAgentDTO: CreateAiAgentDto = {
        name: 'New AI Agent',
        description: 'Un super Agent',
        provider: AiAgentProvider.OLLAMA,
        role: AiAgentRole.ANALYSIS,
        configuration: {
          model: 'llama3.1',
          prompt: "Un super prompt pour l'agent IA 1.",
          stream: false,
          temperature: 0.7,
        },
      };

      const response = await request(app.getHttpServer())
        .post('/agents')
        .send(aiAgentDTO);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'New AI Agent');

      // Vérifier dans la base de données
      const agent = await repository.findOneBy({ id: response.body.id });
      expect(agent).toBeDefined();
      expect(agent?.name).toBe('New AI Agent');
    });

    it('should return 400 for validation errors', async () => {
      const invalidAgent = {
        name: '',
        description: '',
        provider: 'invalid provider',
        role: 'invalide role',
        configuration: {
          model: '',
          prompt: '',
          stream: false,
        },
      };

      const response = await request(app.getHttpServer())
        .post('/agents')
        .send(invalidAgent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain('name should not be empty');
      expect(response.body.message).toContain(
        'description should not be empty',
      );
      expect(response.body.message).toContain(
        'provider must be one of the following values: ollama, openai, anthropic',
      );
      expect(response.body.message).toContain(
        'role must be one of the following values: analysis, editorial, planner, archivist',
      );
      expect(response.body.message).toContain(
        'configuration.model should not be empty',
      );
      expect(response.body.message).toContain(
        'configuration.prompt should not be empty',
      );
    });
  });

  describe('PUT /api/agents/:id', () => {
    it('should update an existing ai agent', async () => {
      const [agent] = await createAiAgentFixtures(repository);

      const updateAgent = {
        name: 'Updated AI Agent',
      };

      const response = await request(app.getHttpServer())
        .put(`/agents/${agent.id}`)
        .send(updateAgent);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', agent.id);
      expect(response.body).toHaveProperty('name', 'Updated AI Agent');
    });

    it('should return 400 for validation errors', async () => {
      const [agent] = await createAiAgentFixtures(repository);

      const updateAgent = {
        name: '',
        description: '',
        provider: 'invalid provider',
        role: 'invalide role',
        configuration: {
          model: '',
          prompt: '',
          stream: false,
        },
      };

      const response = await request(app.getHttpServer())
        .put(`/agents/${agent.id}`)
        .send(updateAgent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain('name should not be empty');
      expect(response.body.message).toContain(
        'description should not be empty',
      );
      expect(response.body.message).toContain(
        'provider must be one of the following values: ollama, openai, anthropic',
      );
      expect(response.body.message).toContain(
        'role must be one of the following values: analysis, editorial, planner, archivist',
      );
      expect(response.body.message).toContain(
        'configuration.model should not be empty',
      );
      expect(response.body.message).toContain(
        'configuration.prompt should not be empty',
      );
    });

    it('should return 404 if ai agent to update is not found', async () => {
      await createAiAgentFixtures(repository);

      const updateAction = {
        name: 'Updated AI Agent',
        description: 'Un super Agent',
        provider: AiAgentProvider.OLLAMA,
        role: AiAgentRole.ANALYSIS,
        configuration: {
          model: 'llama3.1',
          prompt: "Un super prompt pour l'agent IA 1.",
          stream: false,
        },
      };

      const response = await request(app.getHttpServer())
        .put('/agents/999')
        .send(updateAction);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'AI Agent not found.');
    });
  });

  describe('DELETE /agents/:id', () => {
    it('should delete an existing ai agent', async () => {
      const [agent] = await createAiAgentFixtures(repository);

      const response = await request(app.getHttpServer()).delete(
        `/agents/${agent.id}`,
      );

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      // Vérifier dans la base de données
      const dbCollection = await repository.findOneBy({ id: agent.id });
      expect(dbCollection).toBeNull();
    });

    it('should return 404 if ai agent to delete is not found', async () => {
      const response = await request(app.getHttpServer()).delete('/agents/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'AI Agent not found.');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/agents/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'ID must be a positive integer',
      );
    });
  });

  describe('POST /agents/:id/actions (Success Cases)', () => {
    it('should assign new actions to an existing agent', async () => {
      const [agent] = await createAiAgentFixtures(repository);
      const [collection] =
        await createArticleCollectionFixture(collectionRepository);

      const newActionDto = {
        newActions: [
          {
            name: 'Assign to Collection 5',
            type: 'ASSIGN_TO_COLLECTION',
            collectionId: collection.id,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post(`/agents/${agent.id}/actions`)
        .send(newActionDto);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('name', agent.name);
      expect(response.body._actions).toHaveLength(1);
      expect(response.body._actions[0]).toHaveProperty(
        'name',
        'Assign to Collection 5',
      );
    });

    it('should assign existing actions to an agent', async () => {
      const aiAgentDTO: CreateAiAgentDto = {
        name: 'New AI Agent',
        description: 'Un super Agent',
        provider: AiAgentProvider.OLLAMA,
        role: AiAgentRole.ANALYSIS,
        configuration: {
          model: 'llama3.1',
          prompt: "Un super prompt pour l'agent IA.",
          stream: false,
          temperature: 0.7,
        },
      };

      const agentResponse = await request(app.getHttpServer())
        .post('/agents')
        .send(aiAgentDTO);

      const [action] = await createActionFixtures(actionRepository);

      const assignDto = {
        existingActionIds: [action.id],
      };

      const response = await request(app.getHttpServer())
        .post(`/agents/${agentResponse.body.id}/actions`)
        .send(assignDto);

      expect(response.status).toBe(201);
      expect(response.body._actions).toHaveLength(1);
      expect(response.body._actions[0].id).toBe(action.id);
    });

    it('should assign multiple actions (new and existing) to an agent', async () => {
      const [agent] = await createAiAgentFixtures(repository);
      const [collection] =
        await createArticleCollectionFixture(collectionRepository);
      const [existingAction] = await createActionFixtures(actionRepository);

      const assignDto = {
        existingActionIds: [existingAction.id],
        newActions: [
          {
            name: 'New Action for Collection 7',
            type: 'ASSIGN_TO_COLLECTION',
            collectionId: collection.id,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post(`/agents/${agent.id}/actions`)
        .send(assignDto);

      expect(response.status).toBe(201);
      expect(response.body._actions).toHaveLength(2);
    });
  });

  // --- Cas d'Erreurs ---
  describe('POST /agents/:id/actions (Error Cases)', () => {
    it('should return 404 if agent not found', async () => {
      const response = await request(app.getHttpServer())
        .post('/agents/999/actions')
        .send({
          newActions: [
            {
              name: 'New Action',
              type: 'ASSIGN_TO_COLLECTION',
              collectionId: 5,
            },
          ],
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('AI Agent not found.');
    });

    it('should return 404 if action not found in existingActionIds', async () => {
      const [agent] = await createAiAgentFixtures(repository);

      const response = await request(app.getHttpServer())
        .post(`/agents/${agent.id}/actions`)
        .send({
          existingActionIds: [999],
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Action not found.');
    });

    it('should return 409 if action already exists for agent and collection', async () => {
      const [agent] = await createAiAgentFixtures(repository);
      await createActionFixtures(actionRepository);

      const duplicateDto = {
        newActions: [
          {
            name: 'Duplicate Action',
            type: 'ASSIGN_TO_COLLECTION',
            collectionId: 2,
          },
        ],
      };

      await request(app.getHttpServer())
        .post(`/agents/${agent.id}/actions`)
        .send(duplicateDto);

      const response = await request(app.getHttpServer())
        .post(`/agents/${agent.id}/actions`)
        .send(duplicateDto);

      expect(response.status).toBe(409);
      expect(response.body.message).toContain(
        `An action already exists for collection ID : 2.`,
      );
    });

    it('should return 400 for invalid agent ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/agents/invalid-id/actions')
        .send({
          newActions: [
            {
              name: 'Invalid Action',
              type: 'ASSIGN_TO_COLLECTION',
              collectionId: 5,
            },
          ],
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('ID must be a positive integer');
    });

    it('should return 400 for missing fields in payload', async () => {
      const [agent] = await createAiAgentFixtures(repository);

      const invalidPayload = {
        newActions: [{ name: '', type: 'ASSIGN_TO_COLLECTION' }],
      };

      const response = await request(app.getHttpServer())
        .post(`/agents/${agent.id}/actions`)
        .send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        'collectionId - collectionId must be a number conforming to the specified constraints, collectionId should not be empty',
      );
      expect(response.body.message).toContain(
        'name - name should not be empty',
      );
    });

    it('should return 409 for duplicate actions in newActions', async () => {
      const [agent] = await createAiAgentFixtures(repository);
      const [collection] =
        await createArticleCollectionFixture(collectionRepository);

      const duplicatePayload = {
        newActions: [
          {
            name: 'Duplicate 1',
            type: 'ASSIGN_TO_COLLECTION',
            collectionId: collection.id,
          },
          {
            name: 'Duplicate 2',
            type: 'ASSIGN_TO_COLLECTION',
            collectionId: collection.id,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post(`/agents/${agent.id}/actions`)
        .send(duplicatePayload);

      expect(response.status).toBe(409);
      expect(response.body.message).toContain(
        `Duplicate collection IDs detected in newActions: ${collection.id}`,
      );
    });
  });
});
