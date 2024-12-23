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

import { ArticleCollectionEntity } from './article.collection.entity';
import { MediaAttachmentEntity } from './media.attachment.entity';
import { RssFeedCollectionEntity } from './rss-feed.collection.entity';
import { RssFeedEntity } from './rss-feed.entity';
import { TaskEntity } from './task.entity';

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date | null;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date | null;

  @Column({ nullable: true })
  publicationAt: Date | null;

  @Column({ enum: ArticleSourceType })
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
    onDelete: 'CASCADE',
  })
  feed?: RssFeedEntity;

  @Column({ nullable: true })
  link?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'json', nullable: true })
  tags?: { id: string; label: string }[];

  @OneToMany(
    () => MediaAttachmentEntity,
    (mediaAttachment) => mediaAttachment.article,
    {
      cascade: true, // S'assurer que les MediaAttachments sont enregistrés avec l'article
      eager: true, // Charger automatiquement les MediaAttachments avec l'article
    },
  )
  mediaAttachments: MediaAttachmentEntity[];

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, string>;

  @ManyToOne(() => ArticleCollectionEntity, (entity) => entity.articles, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  collection?: RssFeedCollectionEntity;

  @OneToMany(() => TaskEntity, (task) => task.article)
  tasks: TaskEntity[];
}
