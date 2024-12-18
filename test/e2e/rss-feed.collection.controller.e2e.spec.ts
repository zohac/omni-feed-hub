// tests/e2e/RSSFeedCollectionController.e2e.spec.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { RssFeedCollectionEntity } from '../../src/infrastructure/entities';
import { AppModule } from '../../src/presentation/modules/app.module';
import { createRssFeedCollectionFixture } from '../fixtures/rss-feed.collection.fixtures';

describe('RSSFeedCollectionController E2E Tests', () => {
  let repository: Repository<RssFeedCollectionEntity>;
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
    repository = moduleFixture.get<Repository<RssFeedCollectionEntity>>(
      getRepositoryToken(RssFeedCollectionEntity),
    );

    // Nettoyer la table avant chaque test (important en E2E)
    await repository.clear();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /collections/feeds', () => {
    it('should return all collections', async () => {
      await createRssFeedCollectionFixture(repository);

      const response = await request(app.getHttpServer()).get(
        '/collections/feeds',
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name', 'Collection 1');
      expect(response.body[1]).toHaveProperty('name', 'Collection 2');
      expect(response.body[1]).toHaveProperty(
        'description',
        'Une collection de flux rss',
      );
    });

    it('should return an empty array if no collections exist', async () => {
      const response = await request(app.getHttpServer()).get(
        '/collections/feeds',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/collections/feeds/:id', () => {
    it('should return a collection by ID', async () => {
      const [collection] = await createRssFeedCollectionFixture(repository);

      const response = await request(app.getHttpServer()).get(
        `/collections/feeds/${collection.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', collection.id);
      expect(response.body).toHaveProperty('name', 'Collection 1');
    });

    it('should return 404 if collection does not exist', async () => {
      const response = await request(app.getHttpServer()).get(
        '/collections/feeds/999',
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'RSS Feed Collection not found.',
      );
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app.getHttpServer()).get(
        '/collections/feeds/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'ID must be a positive integer',
      );
      expect(response.body).toHaveProperty('error', 'Bad Request');
    });
  });

  describe('POST /api/collections/feeds', () => {
    it('should create a new collection', async () => {
      const newCollection = { name: 'New Collection' };

      const response = await request(app.getHttpServer())
        .post('/collections/feeds')
        .send(newCollection);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'New Collection');

      // Vérifier dans la base de données
      const dbCollection = await repository.findOneBy({ id: response.body.id });
      expect(dbCollection).toBeDefined();
      expect(dbCollection?.name).toBe('New Collection');
    });

    it('should return 400 if validation fails', async () => {
      const invalidCollection = { name: null }; // Supposons que le nom est requis

      const response = await request(app.getHttpServer())
        .post('/collections/feeds')
        .send(invalidCollection);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ]);
    });
  });

  describe('PUT /api/collections/feeds/:id', () => {
    it('should update an existing collection', async () => {
      const [collection] = await createRssFeedCollectionFixture(repository);
      const updatedData = { name: 'Updated Name' };

      const response = await request(app.getHttpServer())
        .put(`/collections/feeds/${collection.id}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', collection.id);
      expect(response.body).toHaveProperty('name', 'Updated Name');

      // Vérifier dans la base de données
      const dbCollection = await repository.findOneBy({ id: collection.id });
      expect(dbCollection).toBeDefined();
      expect(dbCollection?.name).toBe('Updated Name');
    });

    it('should return 400 if validation fails', async () => {
      const [collection] = await createRssFeedCollectionFixture(repository);
      const invalidData = { name: '' }; // Supposons que le nom est requis

      const response = await request(app.getHttpServer())
        .put(`/collections/feeds/${collection.id}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      // expect(response.body.message).toContain('name must be a string');
      expect(response.body.message).toContain('name should not be empty');
    });

    it('should return 404 if collection does not exist', async () => {
      const response = await request(app.getHttpServer())
        .put('/collections/feeds/999')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'RSS Feed Collection not found.',
      );
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app.getHttpServer())
        .put('/collections/feeds/invalid-id')
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'ID must be a positive integer',
      );
    });
  });

  describe('DELETE /api/collections/feeds/:id', () => {
    it('should delete an existing collection', async () => {
      const [collection] = await createRssFeedCollectionFixture(repository);

      const response = await request(app.getHttpServer()).delete(
        `/collections/feeds/${collection.id}`,
      );

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      // Vérifier dans la base de données
      const dbCollection = await repository.findOneBy({ id: collection.id });
      expect(dbCollection).toBeNull();
    });

    it('should return 404 if collection does not exist', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/collections/feeds/999',
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'RSS Feed Collection not found.',
      );
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/collections/feeds/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'ID must be a positive integer',
      );
    });
  });
});
