// src/infrastructure/entities/article.collection.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ArticleEntity } from './article.entity';

@Entity('article_collection')
export class ArticleCollectionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => ArticleEntity, (entity) => entity.collection, {})
  articles?: ArticleEntity[];
}
