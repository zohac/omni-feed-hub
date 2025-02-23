// src/domain/interface/web-scrapper.ts

export interface IWebScraper {
  scrape(url: string): Promise<string | null>;
}
