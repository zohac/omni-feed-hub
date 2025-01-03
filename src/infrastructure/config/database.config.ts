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
  SQLITE = 'sqlite',
}

// Configuration de la base de données
const DATABASE = () => {
  if (DatabaseType.SQLITE === process.env.DATABASE_TYPE) {
    return {
      type: process.env.DATABASE_TYPE as DatabaseType,
      database: process.env.DATABASE_PATH ?? './rss-feeds.sqlite',
      synchronize: TEST || DEVELOPMENT, // Toujours synchroniser en test
      logging: DEVELOPMENT && !TEST, // Activer le logging en développement mais pas en test
      entities: getAllEntities(),
    };
  }

  throw new Error('Unknown database configuration, check your ".env" file');
};

export const redisConfig = {
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

export default registerAs('database', () => DATABASE());
