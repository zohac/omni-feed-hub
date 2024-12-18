// src/infrastructure/entities/rss-feed.entity.ts

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RssFeedCollectionEntity } from './rss-feed.collection.entity';

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

  @ManyToOne(
    () => RssFeedCollectionEntity,
    (collectionEntity) => collectionEntity.feeds,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  collection?: RssFeedCollectionEntity;
}
