import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ArticleSourceType } from '../../domain/enums/article.source.type';

import { ArticleAnalysisEntity } from './article.analyse.entity';
import { ArticleCollectionEntity } from './article.collection.entity';
import { MediaAttachmentEntity } from './media.attachment.entity';
import { PostEntity } from './post.entity';
import { RssFeedCollectionEntity } from './rss-feed.collection.entity';
import { RssFeedEntity } from './rss-feed.entity';
import { TaskEntity } from './task.entity';

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;

  @Column({ nullable: true })
  publicationAt: Date | null;

  @Column({
    type: 'enum',
    enum: ArticleSourceType,
    default: ArticleSourceType.RSS,
  })
  sourceType: ArticleSourceType;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'boolean', default: false })
  isFavorite: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'boolean', default: false })
  isSaved: boolean;

  @ManyToOne(() => RssFeedEntity, {
    cascade: true,
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  feed?: RssFeedEntity;

  @Column({ nullable: true })
  link?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'jsonb', nullable: false, default: () => "'[]'" })
  tags: string[];

  @OneToMany(
    () => MediaAttachmentEntity,
    (mediaAttachment) => mediaAttachment.article,
    {
      cascade: true, // S'assurer que les MediaAttachments sont enregistrés avec l'article
      eager: true, // Charger automatiquement les MediaAttachments avec l'article
    },
  )
  mediaAttachments: MediaAttachmentEntity[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, string>;

  @ManyToOne(() => ArticleCollectionEntity, (entity) => entity.articles, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  collection?: RssFeedCollectionEntity;

  @OneToMany(() => TaskEntity, (task) => task.article)
  tasks: TaskEntity[];

  @ManyToOne(() => PostEntity, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  post?: PostEntity;

  @OneToMany(() => ArticleAnalysisEntity, (analysis) => analysis.article, {
    cascade: true,
  })
  analyses: ArticleAnalysisEntity[];
}
