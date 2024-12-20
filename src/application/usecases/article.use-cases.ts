// src/usecases/article.use-cases.ts

import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import { Article, ArticleSourceType } from '../../domain/entities/Article';
import { MediaAttachment } from '../../domain/entities/media.attachment';
import { IArticleRepository } from '../../domain/interfaces/article.repository';
import { IUsecase } from '../../domain/interfaces/usecase';
import { CreateArticleDto, UpdateArticleDto } from '../dtos/article.dto';

@Injectable()
export class ArticleUseCases
  implements IUsecase<Article, CreateArticleDto, UpdateArticleDto>
{
  constructor(
    @Inject('IRepository<Article>')
    private readonly repository: IArticleRepository,
  ) {}

  async create(articleDTO: CreateArticleDto): Promise<Article> {
    if (undefined !== articleDTO.link) {
      const existingArticle = await this.repository.getOneByLink(
        articleDTO.link,
      );
      if (existingArticle) {
        throw new ConflictException(
          `An article with the link "${articleDTO.link}" already exists.`,
        );
      }
    }

    const article = new Article(
      undefined,
      articleDTO.title,
      new Date(),
      null,
      null,
      ArticleSourceType.MANUAL,
      {
        isRead: articleDTO.state.isRead, // isRead
        isFavorite: articleDTO.state.isFavorite, // isFavorite
        isArchived: articleDTO.state.isArchived, // isArchived
        isSaved: articleDTO.state.isSaved, // isSaved
      },
    );

    article.link = articleDTO.link;
    article.description = articleDTO.description;
    article.content = articleDTO.content;

    if (articleDTO.mediaAttachments) {
      article.mediaAttachments = articleDTO.mediaAttachments.map((media) => {
        return new MediaAttachment(
          undefined,
          media.url ?? '',
          media.type ?? '',
          media.width ?? null,
          media.height ?? null,
          media.length ?? null,
          media.title ?? '',
        );
      });
    }

    // Gestion des Tags
    if (articleDTO.tags) {
      article.tags = articleDTO.tags.map((tag) => ({
        id: tag.id,
        label: tag.label,
      }));
    }

    // Gestion des Metadata
    if (articleDTO.metadata) {
      article.metadata = { ...articleDTO.metadata };
    }

    return await this.repository.create(article);
  }

  async getOneById(id: number): Promise<Article | null> {
    const article = await this.repository.getOneById(id);
    if (!article) {
      throw new HttpException('Article not found.', HttpStatus.NOT_FOUND);
    }

    return await this.repository.getOneById(id);
  }

  async getArticlesByFeedId(feedId: number): Promise<Article[]> {
    return await this.repository.getArticlesByFeedId(feedId);
  }

  async getAll(): Promise<Article[]> {
    return await this.repository.getAll();
  }

  async update(id: number, articleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.repository.getOneById(id);

    // Contrôler les modifications en fonction du sourceType
    this.updateManualArticle(article, articleDto);

    // Propriétés communes
    if (undefined !== articleDto.state?.isRead)
      article.state.isRead = articleDto.state?.isRead;
    if (undefined !== articleDto.state?.isFavorite)
      article.state.isFavorite = articleDto.state.isFavorite;
    if (undefined !== articleDto.state?.isArchived)
      article.state.isArchived = articleDto?.state.isArchived;
    if (undefined !== articleDto.state?.isSaved)
      article.state.isSaved = articleDto.state.isSaved;

    return await this.repository.update(article);
  }

  async delete(id: number): Promise<void> {
    const article = await this.getOneById(id);

    await this.repository.delete(article.id);
  }

  async deleteOldRSSArticles(olderThan: Date): Promise<void> {
    await this.repository.deleteOldRSSArticles(olderThan);
  }

  private updateManualArticle(article: Article, articleDto: UpdateArticleDto) {
    if (article.sourceType === 'manual') {
      // Permettre la modification de toutes les propriétés
      if (articleDto.title !== undefined) article.title = articleDto.title;
      if (articleDto.link !== undefined) article.link = articleDto.link;
      if (articleDto.description !== undefined)
        article.description = articleDto.description;
      if (articleDto.content !== undefined)
        article.content = articleDto.content;
    }
  }

  // async assignToCollection(
  //   article: Article,
  //   articleCollection: ArticleCollection,
  // ): Promise<void> {
  //   if (undefined !== articleCollection.id) {
  //     const collection = await this.collectionRepository.getOneById(
  //       articleCollection.id,
  //     );
  //     if (!collection) {
  //       throw new NotFoundException(
  //         `Collection avec l'ID ${articleCollection.id} non trouvée`,
  //       );
  //     }
  //     article.collection = collection;
  //
  //     await this.repository.update(article);
  //   }
  // }
}
