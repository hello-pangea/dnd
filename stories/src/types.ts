import type { DraggableId, DraggableLocation } from '@react-forked/dnd';

export type Id = string;

export interface AuthorColors {
  soft: string;
  hard: string;
}

export interface Author {
  id: Id;
  name: string;
  avatarUrl: string;
  url: string;
  colors: AuthorColors;
}

export interface Quote {
  id: Id;
  content: string;
  author: Author;
}

export interface Dragging {
  id: DraggableId;
  location: DraggableLocation;
}

export interface QuoteMap {
  [key: string]: Quote[];
}

export interface Task {
  id: Id;
  content: string;
}
