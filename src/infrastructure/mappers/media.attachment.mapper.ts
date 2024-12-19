import { MediaAttachment } from '../../domain/entities/media.attachment';
import { MediaAttachmentEntity } from '../entities';

export class MediaAttachmentMapper {
  static toDomain(entity: MediaAttachmentEntity): MediaAttachment {
    const domain = this.toPartialDomain(entity);

    domain.type = entity.type;
    domain.width = entity.width;
    domain.height = entity.height;
    domain.length = entity.length;
    domain.title = entity.title;

    return domain;
  }

  static toPartialDomain(entity: MediaAttachmentEntity): MediaAttachment {
    return new MediaAttachment(entity.id, entity.url);
  }

  static toEntity(domain: MediaAttachment): MediaAttachmentEntity {
    const entity = this.toPartialEntity(domain);

    entity.type = domain.type;
    entity.width = domain.width;
    entity.height = domain.height;
    entity.length = domain.length;
    entity.title = domain.title;

    return entity;
  }

  static toPartialEntity(domain: MediaAttachment): MediaAttachmentEntity {
    const entity = new MediaAttachmentEntity();

    entity.id = domain.id;
    entity.url = domain.url;

    return entity;
  }
}
