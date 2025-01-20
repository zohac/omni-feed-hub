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
      item: ['media:content'], // Extraction des balises media:content
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
        link: null,
        guid: null,
        title: null,
        pubDate: null,
        creator: null,
        summary: null,
        content: null,
        isoDate: null,
        categories: null,
        contentSnippet: null,
        media: [],
        enclosure: null,
      };

      if (item.link) itemParser.link = item.link;
      if (item.guid) itemParser.guid = item.guid;
      if (item.title) itemParser.title = item.title;
      if (item.pubDate) itemParser.pubDate = item.pubDate;
      if (item.creator) itemParser.creator = item.creator;
      if (item.summary) itemParser.summary = item.summary;
      if (item.content) itemParser.content = item.content;
      if (item.isoDate) itemParser.isoDate = item.isoDate;
      if (item.categories) itemParser.categories = item.categories;
      if (item.contentSnippet) itemParser.contentSnippet = item.contentSnippet;
      if (item.enclosure) itemParser.enclosure = item.enclosure;

      if (item['content:encoded']) {
        if (item['content:encoded'].length > itemParser.content.length)
          itemParser.content = item['content:encoded'];
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
