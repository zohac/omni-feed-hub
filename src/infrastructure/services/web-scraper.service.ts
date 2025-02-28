import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';

import { ILogger } from 'src/domain/interfaces/logger';
import { IWebScraper } from 'src/domain/interfaces/web-scraper';

@Injectable()
export class WebScraperService implements IWebScraper {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
  ) {}

  async scrape(url: string): Promise<string | null> {
    try {
      this.logger.log(`Starting scraping for URL: ${url}`);

      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      // 1️⃣ Priority: <article>
      let content = $('article').text().trim();

      // 2️⃣ If <article> is empty, search alternatives
      if (!content) {
        this.logger.warn(
          `No <article> tag found, searching for alternative content.`,
        );
        content = this.extractMainContent($);
      }

      if (!content) {
        this.logger.error(`Failed to extract meaningful content from ${url}`);

        return null;
      }

      this.logger.log(`Successfully extracted content from ${url}`);
      return content;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Scraping failed for ${url}: ${err.message}`);
    }
  }

  /**
   * Automatically detects the main text block
   */
  private extractMainContent($: CheerioAPI): string {
    const possibleSelectors = ['main', 'section', 'div', 'p'];

    let bestContent = '';
    let bestScore = 0;

    $(possibleSelectors.join(', ')).each((_, element) => {
      const text = $(element).text().trim();
      const wordCount = text.split(/\s+/).length;
      const tagName = $(element).prop('tagName').toLowerCase();

      // 🎯 Score calculation
      const score = this.calculateScore(tagName, wordCount);

      if (score > bestScore) {
        bestScore = score;
        bestContent = text;
      }
    });

    if (!bestContent) {
      this.logger.warn(`No suitable content block found.`);
    } else {
      this.logger.log(
        `Extracted content from <${bestContent.slice(0, 30)}...>`,
      );
    }

    return bestContent;
  }

  /**
   * Calculates a score based on HTML tag type and word count
   */
  private calculateScore(tagName: string, wordCount: number): number {
    const tagWeights = {
      article: 3,
      main: 2.5,
      section: 2,
      div: 1.5,
      p: 1,
    };

    const weight = tagWeights[tagName] || 1;
    return wordCount * weight;
  }
}
