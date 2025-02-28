// src/infrastrucuture/entities/article.analysis.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { ArticleAnalysisStatus } from '../../domain/enums/article.analysis.status';

import { ArticleEntity } from './article.entity';

@Entity('article_analysis')
@Unique(['agent', 'article'])
export class ArticleAnalysisEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ArticleEntity, (article) => article.analyses, {
    onDelete: 'CASCADE', // Supprime les analyses quand l'article est supprimé
  })
  article: ArticleEntity;

  @Column()
  agent: string;

  @Column({
    enum: ArticleAnalysisStatus,
    default: ArticleAnalysisStatus.PENDING,
  })
  status: ArticleAnalysisStatus;

  @Column({ nullable: true })
  result: string;

  @CreateDateColumn()
  createdAt: Date;
}
