// src/usecases/ParseFeedUseCase.ts

import { Inject, Injectable } from '@nestjs/common';

import { Article, ArticleSourceType } from '../../domain/entities/Article';
import { MediaAttachment } from '../../domain/entities/media.attachment';
import { RssFeed } from '../../domain/entities/rss-feed';
import { IArticleRepository } from '../../domain/interfaces/article.repository';
import { ItemParser } from '../../domain/interfaces/item.parser';
import { ILogger } from '../../domain/interfaces/logger';
import { IRssParser } from '../../domain/interfaces/rss-parser';

@Injectable()
export class ParseFeedUseCase {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    @Inject('IRepository<Article>')
    private readonly repository: IArticleRepository,
    @Inject('IRssParser')
    private readonly rssParser: IRssParser,
  ) {}

  async execute(feed: RssFeed): Promise<void> {
    try {
      const parsedFeed = await this.rssParser.parseURL(feed.url);

      for (const item of parsedFeed.items) {
        let articleExist: boolean = false;
        if (item.link)
          articleExist = !!(await this.repository.getOneByLink(item.link));

        if (!articleExist) {
          const images = this.extractImages(item);

          const article = new Article(
            undefined, // id
            item.title ?? 'No title',
            new Date(),
            new Date(),
            item.pubDate ? new Date(item.pubDate) : new Date(),
            ArticleSourceType.RSS,
            {
              isRead: false, // isRead
              isFavorite: false, // isFavorite
              isArchived: false, // isArchived
              isSaved: false, // isSaved
            },
            feed, // feed
            item.link ?? '',
            item.contentSnippet ?? '', // description
            item.content ?? '', // content
            undefined, // tags
            images,
            { guid: item.guid, creator: item.creator }, // metadata
          );

          await this.repository.create(article);
        }
      }
      this.logger.log(`Flux traité avec succès : ${feed.title}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Erreur lors du parsing du flux RSS "${feed.title}":`,
        errorMessage,
      );
    }
  }

  private extractImages(item: ItemParser): MediaAttachment[] {
    const images: MediaAttachment[] = [];

    // Vérifier media:content ajouté via customFields
    if (item.media) {
      item.media.forEach((media) => {
        if (media?.url) {
          images.push(
            new MediaAttachment(
              undefined,
              media.url,
              media.type,
              media.width ? parseInt(String(media.width), 10) : undefined,
              media.height ? parseInt(String(media.height), 10) : undefined,
              undefined,
              '', // Titre ou alt, si disponible
            ),
          );
        }
      });
    }

    return images;
  }
}
