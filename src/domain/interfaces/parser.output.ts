// src/domain/interfaces/parser.output.ts

import { ItemParser } from './item.parser';

export interface IParserOutput {
  title?: string;
  description?: string;
  link?: string;
  image?: {
    link?: string;
    url: string;
    title?: string;
  };
  items: ItemParser[];
}
