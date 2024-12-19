// src/domain/interfaces/rss-parser.ts

import { IParserOutput } from './parser.output';

export interface IRssParser {
  parseURL(feedUrl: string): Promise<IParserOutput>;
}
