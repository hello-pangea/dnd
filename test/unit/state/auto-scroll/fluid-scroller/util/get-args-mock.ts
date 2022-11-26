import type { Position } from 'css-box-model';
import { AutoScrollerOptions } from '../../../../../../src/state/auto-scroller/fluid-scroller/auto-scroller-options-types';
import type { DroppableId } from '../../../../../../src/types';

export default (autoScrollerOptions?: AutoScrollerOptions) => {
  const scrollWindow = jest.fn<void, [Position]>();
  const scrollDroppable = jest.fn<void, [DroppableId, Position]>();

  return {
    scrollWindow,
    scrollDroppable,
    autoScrollerOptions,
  };
};
