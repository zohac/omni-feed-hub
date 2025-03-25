import { Injectable } from '@nestjs/common';
import TurndownService from 'turndown';

@Injectable()
export class HtmlToMdService {
  private readonly turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx', // Utiliser les `#` pour les titres
      bulletListMarker: '-', // Utiliser `-` pour les listes
    });
  }

  convert(html: string): string {
    if (!html) {
      throw new Error('Input HTML cannot be empty');
    }

    return this.turndownService.turndown(html);
  }
}
