import { placeholder } from './data';

export default (container: HTMLElement): CSSStyleDeclaration | null =>
  container.querySelector<HTMLElement>(placeholder.tagName)?.style || null;
