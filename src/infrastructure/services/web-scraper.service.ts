import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import * as he from 'he';
import * as iconv from 'iconv-lite';

import { ILogger } from 'src/domain/interfaces/logger';
import { IWebScraper } from 'src/domain/interfaces/web-scraper';
import { HtmlToMdService } from './html-to-md.service';

@Injectable()
export class WebScraperService implements IWebScraper {
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger,
    private readonly htmlToMdService: HtmlToMdService,
  ) {}

  async scrape(url: string): Promise<string | null> {
    try {
      this.logger.log(`Starting scraping for URL: ${url}`);

      // Récupération de la page en mode binaire (buffer)
      const response = await axios.get(url, {
        responseType: 'arraybuffer', // Permet de récupérer un buffer (pour convertir l'encodage)
      });

      // Détection et conversion d'encodage en UTF-8
      let contentType = response.headers['content-type'] || '';
      let encoding = contentType.includes('charset=')
        ? contentType.split('charset=')[1]
        : 'utf-8';

      if (
        encoding.toLowerCase() === 'iso-8859-1' ||
        encoding.toLowerCase() === 'windows-1252'
      ) {
        this.logger.warn(`Encoding detected: ${encoding}, converting to UTF-8`);
        response.data = iconv.decode(Buffer.from(response.data), encoding);
      } else {
        response.data = response.data.toString('utf-8');
      }

      const $ = cheerio.load(response.data);

      // 🗑️ Suppression des balises inutiles (script, style, etc.)
      $(
        'script, style, noscript, iframe, link, meta, nav, aside, form',
      ).remove();

      // 1️⃣ Priorité à <article> (avec balises HTML)
      let contentHtml = $('article').html()?.trim() || '';

      // 2️⃣ If <article> is empty, search alternatives
      if (!contentHtml) {
        this.logger.warn(
          `No <article> tag found, searching for alternative content.`,
        );
        contentHtml = this.extractMainContent($);
      }

      if (!contentHtml) {
        this.logger.error(`Failed to extract meaningful content from ${url}`);

        return null;
      }

      // 🔥 Décodage des entités HTML (`&quot;`, `&amp;`, etc.)
      contentHtml = he.decode(contentHtml);
      const content = this.htmlToMdService.convert(contentHtml);

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
      const text = $(element).html()?.trim() || '';
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
