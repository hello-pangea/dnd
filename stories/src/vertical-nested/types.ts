import { Quote } from '../types';

export interface NestedQuoteList {
  id: string;
  title: string;
  children: Array<Quote | NestedQuoteList>;
}
