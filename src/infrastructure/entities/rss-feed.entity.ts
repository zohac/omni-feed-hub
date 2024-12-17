// src/infrastructure/entities/RSSFeedEntity.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rss_feed')
export class RssFeedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  url!: string;

  @Column({ nullable: true })
  description?: string;
}
