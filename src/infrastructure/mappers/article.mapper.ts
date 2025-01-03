import { Article } from '../../domain/entities/article';
import { ArticleEntity } from '../entities';

import { ArticleCollectionMapper } from './article.collection.mapper';
import { MediaAttachmentMapper } from './media.attachment.mapper';
import { RssFeedMapper } from './rss-feed.mapper';

export class ArticleMapper {
  static toDomain(entity: ArticleEntity): Article {
    const domain = this.toPartialDomain(entity);

    if (entity.feed) domain.feed = RssFeedMapper.toPartialDomain(entity.feed);
    domain.link = entity.link;
    domain.description = entity.description;
    domain.content = entity.content;
    domain.tags = entity.tags;
    domain.mediaAttachments = [];

    if (undefined !== entity.mediaAttachments) {
      domain.mediaAttachments = entity.mediaAttachments.map((media) =>
        MediaAttachmentMapper.toDomain(media),
      );
    }

    domain.metadata = entity.metadata;

    if (undefined !== entity.collection && null !== entity.collection) {
      domain.collection = ArticleCollectionMapper.toDomain(entity.collection);
    }

    return domain;
  }

  static toPartialDomain(entity: ArticleEntity): Article {
    return new Article(
      entity.id,
      entity.title,
      entity.createdAt,
      entity.updatedAt,
      entity.publicationAt,
      entity.sourceType,
      {
        isRead: entity.isRead, // isRead
        isFavorite: entity.isFavorite, // isFavorite
        isArchived: entity.isArchived, // isArchived
        isSaved: entity.isSaved, // isSaved
      },
    );
  }

  static toEntity(domain: Article): ArticleEntity {
    const entity = this.toPartialEntity(domain);

    entity.link = domain.link;
    entity.description = domain.description;
    entity.content = domain.content;
    entity.tags = domain.tags;

    if (undefined !== domain.mediaAttachments) {
      entity.mediaAttachments = domain.mediaAttachments.map((media) =>
        MediaAttachmentMapper.toEntity(media),
      );
    }

    entity.metadata = domain.metadata;

    if (undefined !== domain.collection) {
      entity.collection = ArticleCollectionMapper.toPartialEntity(
        domain.collection,
      );
    }

    return entity;
  }

  static toPartialEntity(domain: Article): ArticleEntity {
    const entity = new ArticleEntity();

    if (undefined !== domain.id) entity.id = domain.id;
    entity.title = domain.title;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.publicationAt = domain.publicationAt;
    entity.sourceType = domain.sourceType;
    entity.isRead = domain.state.isRead;
    entity.isFavorite = domain.state.isFavorite;
    entity.isArchived = domain.state.isArchived;
    entity.isSaved = domain.state.isSaved;

    if (domain.feed) entity.feed = RssFeedMapper.toPartialEntity(domain.feed);

    return entity;
  }
}
