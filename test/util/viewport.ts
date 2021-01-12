import type { Rect, Position } from 'css-box-model';
import type { Viewport } from '../../src/types';
import getViewport from '../../src/view/window/get-viewport';
import getMaxScroll from '../../src/state/get-max-scroll';
import getDocumentElement from '../../src/view/get-document-element';

export const setWindowScroll = (newScroll: Position) => {
  window.pageYOffset = newScroll.y;
  window.pageXOffset = newScroll.x;
};

export const setViewport = (viewport: Viewport) => {
  if (viewport.scroll.current.x !== viewport.frame.left) {
    throw new Error('scroll x must match left of subject');
  }
  if (viewport.scroll.current.y !== viewport.frame.top) {
    throw new Error('scroll y must match top of subject');
  }

  setWindowScroll(viewport.scroll.current);

  const doc: HTMLElement = getDocumentElement();
  doc.clientWidth = viewport.frame.width;
  doc.clientHeight = viewport.frame.height;

  // reverse engineering these values
  const scrollHeight: number = viewport.scroll.max.y + viewport.frame.height;
  const scrollWidth: number = viewport.scroll.max.x + viewport.frame.width;

  doc.scrollHeight = scrollHeight;
  doc.scrollWidth = scrollWidth;
};

export const getCurrent = (): Viewport => getViewport();

const original: Viewport = getCurrent();

export const resetViewport = () => setViewport(original);

type CreateViewportArgs = {
  frame: Rect;
  scroll: Position;
  scrollHeight: number;
  scrollWidth: number;
};

const origin: Position = { x: 0, y: 0 };

export const createViewport = ({
  frame,
  scroll,
  scrollHeight,
  scrollWidth,
}: CreateViewportArgs): Viewport => {
  const viewport: Viewport = {
    frame,
    scroll: {
      initial: scroll,
      current: scroll,
      max: getMaxScroll({
        scrollHeight,
        scrollWidth,
        width: frame.width,
        height: frame.height,
      }),
      diff: {
        value: origin,
        displacement: origin,
      },
    },
  };
  return viewport;
};

type WithWindowScrollSizeArgs = {
  viewport: Viewport;
  scrollWidth: number;
  scrollHeight: number;
};

export const withWindowScrollSize = ({
  viewport,
  scrollWidth,
  scrollHeight,
}: WithWindowScrollSizeArgs): Viewport =>
  createViewport({
    frame: viewport.frame,
    scroll: viewport.scroll.current,
    scrollHeight,
    scrollWidth,
  });
