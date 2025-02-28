import { DataSource } from 'typeorm';

import * as Entities from '../entities';

export const AppDataSource = new DataSource({
  type: 'postgres', // Forcer l'utilisation de la variable
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true, // Désactivé pour éviter les erreurs
  logging: true,
  entities: Object.values(Entities),
  migrations: ['src/infrastructure/migrations/*.ts'],
});
