import type { Position } from 'css-box-model';
import { AutoScrollConfig } from '../../../../../../src/state/auto-scroller/fluid-scroller/config/autoscroll-config-types';
import type { DroppableId } from '../../../../../../src/types';

export default (autoScrollConfig?: AutoScrollConfig) => {
  const scrollWindow = jest.fn<void, [Position]>();
  const scrollDroppable = jest.fn<void, [DroppableId, Position]>();

  return {
    scrollWindow,
    scrollDroppable,
    autoScrollOptions: autoScrollConfig,
  };
};
