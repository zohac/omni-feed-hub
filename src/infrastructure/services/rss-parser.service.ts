// src/infrastructure/rss-parser/rss-parser.service.ts
import { Injectable } from '@nestjs/common';
import Parser from 'rss-parser';

import { IRssParser } from 'src/domain/interfaces/rss-parser';

import { ItemParser } from '../../domain/interfaces/item.parser';
import { IParserOutput } from '../../domain/interfaces/parser.output';

@Injectable()
export class RssParserService implements IRssParser {
  private readonly parser = new Parser({
    customFields: {
      item: ['media:content', 'media:group', 'yt:videoId', 'yt:channelId'],
    },
  });

  async parseURL(feedUrl: string): Promise<IParserOutput> {
    const parsedFeed = await this.parser.parseURL(feedUrl);

    const parserOutput: IParserOutput = {
      title: parsedFeed.title,
      description: parsedFeed.description,
      link: parsedFeed.link,
      image: parsedFeed.image,
      items: [],
    };

    parserOutput.items = parsedFeed.items.map((item): ItemParser => {
      const itemParser: ItemParser = {
        link: item.link || null,
        guid: item.guid || null,
        title: item.title || null,
        pubDate: item.pubDate || null,
        creator: item.creator || null,
        summary: item.summary || null,
        content: item.content || null,
        isoDate: item.isoDate || null,
        categories: item.categories || null,
        contentSnippet: item.contentSnippet || null,
        media: [],
        enclosure: item.enclosure || null,
        videoId: item['yt:videoId'] || null,
        channelId: item['yt:channelId'] || null,
      };

      if (item['media:group']) {
        const mediaGroup = item['media:group'];

        // 📌 Extraction de la description enrichie
        if (mediaGroup['media:description']) {
          itemParser.contentSnippet = mediaGroup['media:description'];
        }

        // 📸 Extraction de la miniature
        if (mediaGroup['media:thumbnail']) {
          mediaGroup['media:thumbnail'].forEach((media) => {
            const attributes = media['$'];

            itemParser.media.push({
              url: attributes.url,
              type: 'image',
              width: attributes.width
                ? parseInt(attributes.width, 10)
                : undefined,
              height: attributes.height
                ? parseInt(attributes.height, 10)
                : undefined,
            });
          });
        }

        if (mediaGroup['media:content']) {
          const mediaContent = Array.isArray(mediaGroup['media:content'])
            ? mediaGroup['media:content']
            : [mediaGroup['media:content']];

          mediaContent.forEach((media) => {
            const attributes = media['$']; // Récupérer les attributs dans $
            if (attributes?.url) {
              itemParser.media.push({
                url: attributes.url,
                type: attributes.type,
                width: attributes.width
                  ? parseInt(attributes.width, 10)
                  : undefined,
                height: attributes.height
                  ? parseInt(attributes.height, 10)
                  : undefined,
              });
            }
          });
        }

        // 🎥 Extraction du lien vidéo (reconstruction propre)
        if (itemParser.videoId) {
          itemParser.link = `https://www.youtube.com/watch?v=${itemParser.videoId}`;
        }
      }

      if (item['media:content']) {
        const mediaContent = Array.isArray(item['media:content'])
          ? item['media:content']
          : [item['media:content']];

        mediaContent.forEach((media) => {
          const attributes = media['$']; // Récupérer les attributs dans $
          if (attributes?.url) {
            itemParser.media.push({
              url: attributes.url,
              type: attributes.type,
              width: attributes.width
                ? parseInt(attributes.width, 10)
                : undefined,
              height: attributes.height
                ? parseInt(attributes.height, 10)
                : undefined,
            });
          }
        });
      }

      return itemParser;
    });

    return parserOutput;
  }
}
