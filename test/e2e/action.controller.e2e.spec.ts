// tests/e2e/RSSFeedController.e2e.test.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { CreateAssignToCollectionActionDto } from '../../src/application/dtos/assign.to.collection.action.dto';
import { ActionType } from '../../src/domain/enums/action.type';
import {
  ActionEntity,
  ArticleCollectionEntity,
} from '../../src/infrastructure/entities';
import { AppModule } from '../../src/presentation/modules/app.module';
import { createActionFixtures } from '../fixtures/action.fixtures';
import { createArticleCollectionFixture } from '../fixtures/article.collection.fixtures';

describe('AIAgentController E2E Tests', () => {
  let repository: Repository<ActionEntity>;
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
    repository = moduleFixture.get<Repository<ActionEntity>>(
      getRepositoryToken(ActionEntity),
    );
    collectionRepository = moduleFixture.get<
      Repository<ArticleCollectionEntity>
    >(getRepositoryToken(ArticleCollectionEntity));

    // Nettoyer la table avant chaque test (important en E2E)
    await repository.clear();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/actions', () => {
    it('should return all Action', async () => {
      await createActionFixtures(repository);

      const response = await request(app.getHttpServer()).get('/actions');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name', 'Action 1');
      expect(response.body[1]).toHaveProperty('name', 'Action 2');
    });

    it('should return an empty array if no collections exist', async () => {
      const response = await request(app.getHttpServer()).get('/actions');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/actions/:id', () => {
    it('should return an action by ID', async () => {
      const [agent] = await createActionFixtures(repository);

      const response = await request(app.getHttpServer()).get(
        `/actions/${agent.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Action 1');
    });

    it('should return 404 if action not found', async () => {
      const agents = [];
      agents.push(await createActionFixtures(repository));

      const response = await request(app.getHttpServer()).get('/actions/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Action not found.');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/actions/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'ID must be a positive integer',
      );
      expect(response.body).toHaveProperty('error', 'Bad Request');
    });
  });

  describe('POST /api/actions', () => {
    it('should create a new action', async () => {
      const [collection] =
        await createArticleCollectionFixture(collectionRepository);

      const aiActionDTO: CreateAssignToCollectionActionDto = {
        name: 'New Action',
        type: ActionType.ASSIGN_TO_COLLECTION,
        collectionId: collection.id,
      };

      const response = await request(app.getHttpServer())
        .post('/actions')
        .send(aiActionDTO);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'New Action');

      // Vérifier dans la base de données
      const action = await repository.findOneBy({ id: response.body.id });
      expect(action).toBeDefined();
      expect(action?.name).toBe('New Action');
    });

    it('should return 400 for validation error on type', async () => {
      const invalidAgent = {
        name: '',
        type: 'Cool type',
        collectionId: 'invalid-id',
      };

      const response = await request(app.getHttpServer())
        .post('/actions')
        .send(invalidAgent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty(
        'message',
        'Unsupported action type: Cool type',
      );
    });

    it('should return 400 for validation errors', async () => {
      const invalidAgent = {
        name: '',
        type: ActionType.ASSIGN_TO_COLLECTION,
        collectionId: 'invalid-id',
      };

      const response = await request(app.getHttpServer())
        .post('/actions')
        .send(invalidAgent);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain(
        'collectionId - collectionId must be a number conforming to the specified constraints',
      );
      expect(response.body.message).toContain(
        'name - name should not be empty',
      );
    });

    it('should return 409 if action with this collection exist', async () => {
      const [collection] =
        await createArticleCollectionFixture(collectionRepository);

      const aiActionDtoOne: CreateAssignToCollectionActionDto = {
        name: 'New Action 1',
        type: ActionType.ASSIGN_TO_COLLECTION,
        collectionId: collection.id,
      };

      await request(app.getHttpServer()).post('/actions').send(aiActionDtoOne);

      const aiActionDtoTwo: CreateAssignToCollectionActionDto = {
        name: 'New Action 2',
        type: ActionType.ASSIGN_TO_COLLECTION,
        collectionId: collection.id,
      };

      const response = await request(app.getHttpServer())
        .post('/actions')
        .send(aiActionDtoTwo);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        `An action already exists for collection ID : ${collection.id}.`,
      );
    });
  });

  describe('PUT /api/actions/:id', () => {
    it('should update an existing action', async () => {
      const [action] = await createActionFixtures(repository);

      const updateAgent = {
        name: 'Updated Action',
      };

      const response = await request(app.getHttpServer())
        .put(`/actions/${action.id}`)
        .send(updateAgent);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', action.id);
      expect(response.body).toHaveProperty('name', 'Updated Action');
    });

    it('should return 400 for validation error on type', async () => {
      const [action] = await createActionFixtures(repository);

      const updateAction = {
        type: 'Cool type',
      };

      const response = await request(app.getHttpServer())
        .put(`/actions/${action.id}`)
        .send(updateAction);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty(
        'message',
        'Unsupported action type: Cool type',
      );
    });

    it('should return 400 for validation errors', async () => {
      const [action] = await createActionFixtures(repository);

      const updateAction = {
        name: '',
        collectionId: 'invalid-id',
      };

      const response = await request(app.getHttpServer())
        .put(`/actions/${action.id}`)
        .send(updateAction);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain(
        'collectionId - collectionId must be a number conforming to the specified constraints',
      );
      expect(response.body.message).toContain(
        'name - name should not be empty',
      );
    });

    it('should return 404 if action to update is not found', async () => {
      await createActionFixtures(repository);

      const updateAction = {};

      const response = await request(app.getHttpServer())
        .put('/actions/999')
        .send(updateAction);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Action not found.');
    });
  });

  describe('DELETE /actions/:id', () => {
    it('should delete an existing action', async () => {
      const [agent] = await createActionFixtures(repository);

      const response = await request(app.getHttpServer()).delete(
        `/actions/${agent.id}`,
      );

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      // Vérifier dans la base de données
      const dbCollection = await repository.findOneBy({ id: agent.id });
      expect(dbCollection).toBeNull();
    });

    it('should return 404 if action to delete is not found', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/actions/999',
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Action not found.');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/actions/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'ID must be a positive integer',
      );
    });
  });
});
