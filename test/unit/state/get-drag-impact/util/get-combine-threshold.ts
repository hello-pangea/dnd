import type { Position } from 'css-box-model';
import type { Axis, DraggableDimension } from '../../../../../src/types';
import { patch } from '../../../../../src/state/position';
import { combineThresholdDivisor } from '../../../../../src/state/get-drag-impact/get-combine-impact';

export function getThreshold(
  axis: Axis,
  draggable: DraggableDimension,
): Position {
  return patch(
    axis.line,
    draggable.page.borderBox[axis.size] / combineThresholdDivisor,
  );
}
