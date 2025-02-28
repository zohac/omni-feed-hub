// src/infrastructure/mappers/post.mapper.ts

import { Post } from 'src/domain/entities/post';

import { PostEntity } from '../entities';

import { ArticleMapper } from './article.mapper';
import { MediaAttachmentMapper } from './media.attachment.mapper';

export class PostMapper {
  static toDomain(entity: PostEntity): Post {
    const domain = this.toPartialDomain(entity);

    if (entity.attachments) {
      domain.attachments = entity.attachments.map((attachmentEntity) =>
        MediaAttachmentMapper.toDomain(attachmentEntity),
      );
    }

    if (entity.articles) {
      domain.articles = entity.articles.map((articleEntity) =>
        ArticleMapper.toDomain(articleEntity),
      );
    }

    return domain;
  }

  /**
   * toPartialDomain peut servir si vous souhaitez réutiliser
   * une conversion "incomplète" ailleurs.
   */
  static toPartialDomain(entity: PostEntity): Post {
    return new Post(
      entity.id,
      entity.title,
      entity.content,
      entity.originalContent,
      entity.recommendation,
      entity.explanation,
      entity.scheduledAt,
      entity.publishedAt,
      entity.published,
    );
  }

  static toEntity(domain: Post): PostEntity {
    const entity = this.toPartialEntity(domain);

    entity.attachments = [];
    if (domain.attachments && domain.attachments.length > 0) {
      entity.attachments = domain.attachments.map((attach) => {
        const attachEntity = MediaAttachmentMapper.toEntity(attach);
        // Liaison inverse
        attachEntity.post = entity;
        return attachEntity;
      });
    }

    if (domain.articles && domain.articles.length > 0) {
      entity.articles = domain.articles.map((articleEntity) =>
        ArticleMapper.toEntity(articleEntity),
      );
    }

    return entity;
  }

  static toPartialEntity(domain: Post): PostEntity {
    const entity = new PostEntity();

    if (domain.id) {
      entity.id = domain.id;
    }
    entity.title = domain.title;
    entity.content = domain.content;
    entity.originalContent = domain.originalContent;
    entity.recommendation = domain.recommendation;
    entity.explanation = domain.explanation;
    entity.scheduledAt = domain.scheduledAt;
    entity.publishedAt = domain.publishedAt;
    entity.published = domain.published;

    return entity;
  }
}
