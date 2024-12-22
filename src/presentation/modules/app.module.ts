import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig from '../../infrastructure/config/database.config';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { InfrastructureScheduleModule } from '../../infrastructure/schedulers/schedule.module';

import { AiAgentModule } from './ai-agent/ai-agent.module';
import { ArticleCollectionModule } from './article-collection/article.collection.module';
import { ArticleModule } from './article/article.module';
import { RssFeedCollectionModule } from './rss-feed-collection/rss-feed.collection.module';
import { RssFeedModule } from './rss-feed/rss-feed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true, // Rendre ConfigService accessible partout
      load: [databaseConfig], // Charger la config via registerAs('database', ...)
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Récupère l'objet renvoyé par "registerAs('database', ...)"
        // Note : par défaut, configService.get('database') va récupérer
        // l'objet retourné par la fonction default() dans database.config.ts
        return configService.get('database');
      },
      inject: [ConfigService],
    }),
    InfrastructureModule,
    InfrastructureScheduleModule,
    RssFeedModule,
    RssFeedCollectionModule,
    ArticleModule,
    ArticleCollectionModule,
    AiAgentModule,
  ],
})
export class AppModule {}
