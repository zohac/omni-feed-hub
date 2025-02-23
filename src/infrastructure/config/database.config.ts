// src/infrastructure/config/database.config.ts

import { registerAs } from '@nestjs/config';

import * as Entities from '../entities';

/**
 * Useful to declare all entities in connection interface
 */
export const getAllEntities = () => {
  return Object.values(Entities);
};

// Déterminer l'environnement actuel (default à 'development')
const NODE_ENV = process.env.NODE_ENV ?? 'development';

// Environnements
export const DEVELOPMENT = NODE_ENV === 'development';
export const TEST = NODE_ENV === 'test';
export const PRODUCTION = NODE_ENV === 'production';

enum DatabaseType {
  POSTGRES = 'postgres',
}

// Configuration de la base de données
const DATABASE = () => {
  if (process.env.DATABASE_TYPE !== DatabaseType.POSTGRES) {
    throw new Error('Only PostgreSQL is supported. Check your ".env" file.');
  }

  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: TEST || DEVELOPMENT, // Toujours synchroniser en test
    logging: DEVELOPMENT && !TEST, // Activer le logging en développement mais pas en test
    entities: getAllEntities(),
    migrations: ['src/infrastructure/migrations/*.ts'],
  };
};

export const redisConfig = {
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

export default registerAs('database', () => DATABASE());
