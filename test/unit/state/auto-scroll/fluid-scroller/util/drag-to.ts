import type { Position } from 'css-box-model';
import type {
  Viewport,
  DragImpact,
  DraggingState,
  DroppableDimension,
  DimensionMap,
} from '../../../../../../src/types';
import patchDimensionMap from '../../../../../../src/state/patch-dimension-map';

type DragToArgs = {
  selection: Position;
  viewport: Viewport;
  state: any;
  impact?: DragImpact;
  droppable?: DroppableDimension;
};

export default ({
  selection,
  viewport,

  // seeding that we are over the home droppable
  impact,

  state,
  droppable,
}: DragToArgs): DraggingState => {
  const base: DraggingState = state.dragging(
    state.preset.inHome1.descriptor.id,
    selection,
    viewport,
  );

  const dimensions: DimensionMap = (() => {
    if (!droppable) {
      return base.dimensions;
    }
    return patchDimensionMap(base.dimensions, droppable);
  })();

  return {
    ...base,
    // add impact if needed
    impact: impact || base.impact,
    // add droppable if needed
    dimensions,
  };
};
