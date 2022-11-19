import type { Position } from 'css-box-model';
import { AutoScrollOptions } from '../../../../../../src/state/auto-scroller/fluid-scroller/autoscroll-config-types';
import type { DroppableId } from '../../../../../../src/types';

export default (autoScrollOptions?: AutoScrollOptions) => {
  const scrollWindow = jest.fn<void, [Position]>();
  const scrollDroppable = jest.fn<void, [DroppableId, Position]>();

  return {
    scrollWindow,
    scrollDroppable,
    autoScrollOptions,
  };
};
