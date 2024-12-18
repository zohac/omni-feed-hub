// src/infrastructure/entities/rss-feed.collection.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RssFeedEntity } from './rss-feed.entity';

@Entity('rss_feed_collection')
export class RssFeedCollectionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(
    () => RssFeedEntity,
    (rssFeedEntity) => rssFeedEntity.collection,
    {},
  )
  feeds?: RssFeedEntity[];
}
