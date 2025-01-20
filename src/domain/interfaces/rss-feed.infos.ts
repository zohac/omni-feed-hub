// src/domain/interfaces/rss-feed.infos.ts

export interface RssFeedInfo {
  title?: string;
  description?: string;
  link?: string;
  image?: {
    link?: string;
    url: string;
    title?: string;
  };
}
