// tests/e2e/ArticleController.e2e.test.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import {
  CreateArticleDto,
  UpdateArticleDto,
} from '../../src/application/dtos/article.dto';
import { ArticleEntity } from '../../src/infrastructure/entities';
import { AppModule } from '../../src/presentation/modules/app.module';
import { createArticlesFixture } from '../fixtures/article.fixtures';

describe('ArticleController E2E Tests', () => {
  let repository: Repository<ArticleEntity>;
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
    repository = moduleFixture.get<Repository<ArticleEntity>>(
      getRepositoryToken(ArticleEntity),
    );

    // Nettoyer la table avant chaque test (important en E2E)
    await repository.clear();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/articles', () => {
    it('should return all Articles', async () => {
      await createArticlesFixture(repository);
      const response = await request(app.getHttpServer()).get('/articles');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title', 'Sample Article 1');
      expect(response.body[1]).toHaveProperty('title', 'Sample Article 2');
    });

    it('should return an empty array if no collections exist', async () => {
      const response = await request(app.getHttpServer()).get('/articles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/articles/:id', () => {
    it('should return a article by ID', async () => {
      const [article] = await createArticlesFixture(repository);

      const response = await request(app.getHttpServer()).get(
        `/articles/${article.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Sample Article 1');
    });

    it('should return 404 if article not found', async () => {
      await createArticlesFixture(repository);

      const response = await request(app.getHttpServer()).get('/articles/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Article not found.');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/articles/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'ID must be a positive integer',
      );
      expect(response.body).toHaveProperty('error', 'Bad Request');
    });
  });

  describe('POST /api/articles', () => {
    it('should create a new article', async () => {
      const newArticleDTO: CreateArticleDto = {
        title: 'Sample Article',
        state: {
          isRead: false,
          isFavorite: false,
          isArchived: false,
          isSaved: false,
        },
        link: 'https://example.com/article',
        description: 'A brief description of the article.',
        content: 'Detailed content of the article.',
        tags: [
          {
            id: 'tag1',
            label: 'Technology',
          },
        ],
        metadata: {
          guid: 'value',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/articles')
        .send(newArticleDTO);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'Sample Article');

      // Vérifier dans la base de données
      const article = await repository.findOneBy({ id: response.body.id });
      expect(article).toBeDefined();
      expect(article?.title).toBe('Sample Article');
    });

    it('should return 400 for validation errors', async () => {
      const invalidArticle = {
        title: '',
        link: 'http://fake.article.com/new',
        description: 'Une description pour le nouvel article.',
        content: 'Un contenu plus long pour le nouvel article.',
      };

      const response = await request(app.getHttpServer())
        .post('/articles')
        .send(invalidArticle);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain('title should not be empty');
      expect(response.body.message).toContain('state should not be empty');
    });

    it('should return 400 if link already exist', async () => {
      await createArticlesFixture(repository);

      const articleExist = {
        title: 'Sample Article 1',
        state: {
          isRead: false,
          isFavorite: false,
          isArchived: false,
          isSaved: false,
        },
        link: 'https://example.com/article',
        description: 'A brief description of the article.',
        content: 'Detailed content of the article.',
        tags: [
          {
            id: 'tag1',
            label: 'Technology',
          },
        ],
        metadata: {
          guid: 'An guid value',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/articles')
        .send(articleExist);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Conflict');
    });
  });

  describe('PUT /api/articles/:id', () => {
    it('should update an existing article', async () => {
      const [article] = await createArticlesFixture(repository);

      const updateAction: UpdateArticleDto = {
        title: 'Updated Article',
      };

      const response = await request(app.getHttpServer())
        .put(`/articles/${article.id}`)
        .send(updateAction);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', article.id);
      expect(response.body).toHaveProperty('title', 'Updated Article');
    });

    it('should return 400 for validation errors', async () => {
      const [article] = await createArticlesFixture(repository);

      const updateAction = {
        state: {
          isRead: 'false',
        },
      };

      const response = await request(app.getHttpServer())
        .put(`/articles/${article.id}`)
        .send(updateAction);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain(
        'state.isRead must be a boolean value',
      );
      expect(response.body.message).toContain(
        'state.isFavorite should not be empty',
      );
      expect(response.body.message).toContain(
        'state.isFavorite must be a boolean value',
      );
      expect(response.body.message).toContain(
        'state.isArchived should not be empty',
      );
      expect(response.body.message).toContain(
        'state.isArchived must be a boolean value',
      );
      expect(response.body.message).toContain(
        'state.isSaved should not be empty',
      );
      expect(response.body.message).toContain(
        'state.isSaved must be a boolean value',
      );
    });

    it('should return 400 if article to update is not found', async () => {
      await createArticlesFixture(repository);

      const updateAction = {
        name: 'Updated Action',
      };

      const response = await request(app.getHttpServer())
        .put('/articles/999')
        .send(updateAction);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/articles/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'ID must be a positive integer',
      );
    });
  });

  describe('DELETE /api/articles/:id', () => {
    it('should delete an existing article', async () => {
      const [article] = await createArticlesFixture(repository);

      const response = await request(app.getHttpServer()).delete(
        `/articles/${article.id}`,
      );

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      const rssFeed = await repository.findOneBy({ id: article.id });
      expect(rssFeed).toBeNull();
    });

    it('should return 404 if article to delete is not found', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/articles/999',
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Article not found.');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/articles/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'ID must be a positive integer',
      );
    });
  });
});
