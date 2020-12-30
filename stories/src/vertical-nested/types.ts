import { Quote } from '../types';

export type NestedQuoteList = {
  id: string;
  title: string;
  children: Array<Quote | NestedQuoteList>;
};
