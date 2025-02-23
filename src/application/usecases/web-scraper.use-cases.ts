import { Inject, Injectable } from '@nestjs/common';
import { IWebScraper } from 'src/domain/interfaces/web-scraper';

@Injectable()
export class WebScraperUseCase {
  constructor(
    @Inject('IWebScraper')
    private readonly webScraperService: IWebScraper
  ) {}

  async scrape(url: string): Promise<string | null> {
    if (!url) {
      throw new Error('L’URL est requise.');
    }

    return this.webScraperService.scrape(url);
  }
}
