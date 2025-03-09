// src/infrastructure/entities/rss-feed.stats.entity.ts

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RssFeedEntity } from './rss-feed.entity';

@Entity('rss_feed_stats')
export class RssFeedStatsEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => RssFeedEntity, (feed) => feed.stats, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  feed!: RssFeedEntity;

  @Column()
  totalArticles!: number;

  @Column()
  unreadArticles!: number;

  @Column()
  favoriteArticles!: number;

  @Column()
  archivedArticles!: number;

  @Column()
  savedArticles!: number;
}
