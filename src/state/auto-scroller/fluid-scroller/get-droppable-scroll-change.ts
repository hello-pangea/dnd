import type { Position, Rect } from 'css-box-model';
import type { Scrollable, DroppableDimension } from '../../../types';
import getScroll from './get-scroll';
import { canScrollDroppable } from '../can-scroll';
import { AutoScrollOptions } from './autoscroll-config-types';

interface Args {
  droppable: DroppableDimension;
  subject: Rect;
  center: Position;
  dragStartTime: number;
  shouldUseTimeDampening: boolean;
  getAutoScrollOptions: () => AutoScrollOptions;
}

export default ({
  droppable,
  subject,
  center,
  dragStartTime,
  shouldUseTimeDampening,
  getAutoScrollOptions,
}: Args): Position | null => {
  // We know this has a closestScrollable
  const frame: Scrollable | null = droppable.frame;

  // this should never happen - just being safe
  if (!frame) {
    return null;
  }

  const scroll: Position | null = getScroll({
    dragStartTime,
    container: frame.pageMarginBox,
    subject,
    center,
    shouldUseTimeDampening,
    getAutoScrollOptions,
  });

  return scroll && canScrollDroppable(droppable, scroll) ? scroll : null;
};
