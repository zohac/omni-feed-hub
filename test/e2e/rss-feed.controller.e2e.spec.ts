import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import {
  CreateRssFeedDto,
  UpdateRssFeedDto,
} from '../../src/application/dtos/rss-feed.dto';
import { RssFeedEntity } from '../../src/infrastructure/entities';
import { AppModule } from '../../src/presentation/modules/app.module';
import { createRssFeedFixture } from '../fixtures/rss-feed.fixtures';

describe('RssFeedController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<RssFeedEntity>;

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
    repository = moduleFixture.get<Repository<RssFeedEntity>>(
      getRepositoryToken(RssFeedEntity),
    );

    // Nettoyer la table avant chaque test (important en E2E)
    await repository.clear();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/feeds', () => {
    it('should return all RSS feeds', async () => {
      await createRssFeedFixture(repository);

      const response = await request(app.getHttpServer()).get('/feeds');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title', 'Feed 1');
      expect(response.body[1]).toHaveProperty('title', 'Feed 2');
    });

    it('should return an empty array if no collections exist', async () => {
      const response = await request(app.getHttpServer()).get('/feeds');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/feeds/:id', () => {
    it('should return a feed by ID', async () => {
      const [feed] = await createRssFeedFixture(repository);

      const response = await request(app.getHttpServer()).get(
        `/feeds/${feed.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Feed 1');
    });

    it('should return 404 if feed not found', async () => {
      await createRssFeedFixture(repository);

      const response = await request(app.getHttpServer()).get('/feeds/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Feed not found.');
      expect(response.body).toHaveProperty('statusCode', HttpStatus.NOT_FOUND);
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/feeds/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'ID must be a positive integer',
      );
    });
  });

  describe('POST /api/feeds', () => {
    it('should create a new feed', async () => {
      const newFeedDTO: CreateRssFeedDto = {
        title: 'New Feed',
        url: 'http://example.com/newfeed',
        description: 'New feed description',
      };

      const response = await request(app.getHttpServer())
        .post('/feeds')
        .send(newFeedDTO);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'New Feed');

      // Vérifier dans la base de données
      const feed = await repository.findOneBy({ id: response.body.id });
      expect(feed).toBeDefined();
      expect(feed?.title).toBe('New Feed');
    });

    it('should return 400 for validation errors', async () => {
      const invalidFeed: CreateRssFeedDto = {
        title: null, // Title is required and should not be empty
        url: 'invalid-url',
      };

      const response = await request(app.getHttpServer())
        .post('/feeds')
        .send(invalidFeed);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toEqual([
        'title must be a string',
        'url must be a URL address',
      ]);
    });
  });

  describe('PUT /api/feeds/:id', () => {
    it('should update an existing feed', async () => {
      const [feed] = await createRssFeedFixture(repository);

      const updateFeed: UpdateRssFeedDto = {
        title: 'Updated Feed',
        url: feed.url,
        description: 'Une super description mis à jour',
      };

      const response = await request(app.getHttpServer())
        .put(`/feeds/${feed.id}`)
        .send(updateFeed);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', feed.id);
      expect(response.body).toHaveProperty('title', 'Updated Feed');
      expect(response.body).toHaveProperty('url', feed.url);
      expect(response.body).toHaveProperty(
        'description',
        'Une super description mis à jour',
      );
    });

    it('should return 400 for validation errors', async () => {
      const [feed] = await createRssFeedFixture(repository);

      const updateFeed: UpdateRssFeedDto = {
        title: '',
        url: 'invalid-url',
      };

      const response = await request(app.getHttpServer())
        .put(`/feeds/${feed.id}`)
        .send(updateFeed);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body.message).toContain('url must be a URL address');
      expect(response.body.message).toContain('title should not be empty');
    });

    it('should return 404 if feed to update is not found', async () => {
      await createRssFeedFixture(repository);

      const updateFeed = {
        title: 'Updated Feed',
      };

      const response = await request(app.getHttpServer())
        .put('/feeds/999')
        .send(updateFeed);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Feed not found.');
    });
  });

  describe('DELETE /api/feeds/:id', () => {
    it('should delete an existing feed', async () => {
      const [feed] = await createRssFeedFixture(repository);

      const response = await request(app.getHttpServer()).delete(
        `/feeds/${feed.id}`,
      );

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      const rssFeed = await repository.findOneBy({ id: feed.id });
      expect(rssFeed).toBeNull();
    });

    it('should return 404 if feed to delete is not found', async () => {
      const response = await request(app.getHttpServer()).delete('/feeds/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Feed not found.');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/feeds/invalid-id',
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'ID must be a positive integer',
      );
    });
  });
});
