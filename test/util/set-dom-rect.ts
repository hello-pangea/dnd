import type { Rect } from 'css-box-model';

export default function setDOMRect(rect: Rect): DOMRect {
  return {
    ...rect,
    toJSON() {
      return JSON.stringify(rect);
    },
  };
}
