// src/usecases/ParseFeedUseCase.ts

import { Inject, Injectable } from '@nestjs/common';

import { Article } from '../../domain/entities/article';
import { MediaAttachment } from '../../domain/entities/media.attachment';
import { RssFeed } from '../../domain/entities/rss-feed';
import { ArticleSourceType } from '../../domain/enums/article.source.type';
import { IArticleRepository } from '../../domain/interfaces/article.repository';
import { ItemParser } from '../../domain/interfaces/item.parser';
import { ILogger } from '../../domain/interfaces/logger';
import { RssFeedInfo } from '../../domain/interfaces/rss-feed.infos';
import { IRssParser } from '../../domain/interfaces/rss-parser';

@Injectable()
export class ParseFeedUseCases {
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
        if (item.link) {
          const article = await this.repository.getOneByLink(item.link);

          if (article) articleExist = true;

          article.feed = feed;
          await this.repository.update(article);
        }

        if (!articleExist) {
          const images = this.extractImages(item);

          const article = new Article(
            undefined, // id
            item.title ?? 'No title',
            null,
            null,
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
      this.logger.log(`Feed processed successfully : ${feed.title}`);
    } catch (error) {
      this.catchError(error, feed.title);
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

  async getFeedInfo(url: string): Promise<RssFeedInfo> {
    try {
      const parsedFeed = await this.rssParser.parseURL(url);

      return {
        title: parsedFeed.title,
        description: parsedFeed.description,
        link: parsedFeed.link,
        image: parsedFeed.image,
      };
    } catch (error) {
      this.catchError(error, url);
    }
  }

  private catchError(error: Error, text: string) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.error(
      `Error during RSS feed parsing : "${text}":`,
      errorMessage,
    );
  }
}
