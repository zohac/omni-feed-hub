// src/domain/interfaces/item.parser.ts

export interface ItemParser {
  link?: string;
  guid?: string;
  title?: string;
  pubDate?: string;
  creator?: string;
  summary?: string;
  content?: string;
  isoDate?: string;
  categories?: string[];
  contentSnippet?: string;
  media?: {
    url?: string;
    medium?: string;
    type?: string;
    width?: number;
    height?: number;
  }[];
  enclosure?: {
    url: string;
    length?: number;
    type?: string;
  };
}
