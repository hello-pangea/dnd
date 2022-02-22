import type { Position, Rect } from 'css-box-model';
import type { Axis } from '../../../../../src/types';
import { patch, subtract } from '../../../../../src/state/position';

interface ForStart {
  startEdgeOn: Position;
  dragging: Rect;
  axis: Axis;
}

export function getOffsetForStartEdge({
  startEdgeOn,
  dragging,
  axis,
}: ForStart): Position {
  const offset: Position = subtract(
    startEdgeOn,
    patch(axis.line, dragging[axis.start], dragging.center[axis.crossAxisLine]),
  );
  return offset;
}

interface ForCrossAxisStart {
  crossAxisStartEdgeOn: Position;
  dragging: Rect;
  axis: Axis;
}

export function getOffsetForCrossAxisStartEdge({
  crossAxisStartEdgeOn,
  dragging,
  axis,
}: ForCrossAxisStart): Position {
  const offset: Position = subtract(
    crossAxisStartEdgeOn,
    patch(axis.line, dragging.center[axis.line], dragging[axis.crossAxisStart]),
  );
  return offset;
}

interface ForEnd {
  endEdgeOn: Position;
  dragging: Rect;
  axis: Axis;
}

export function getOffsetForEndEdge({
  endEdgeOn,
  dragging,
  axis,
}: ForEnd): Position {
  const offset: Position = subtract(
    endEdgeOn,
    patch(axis.line, dragging[axis.end], dragging.center[axis.crossAxisLine]),
  );
  return offset;
}

interface ForCrossAxisEnd {
  crossAxisEndEdgeOn: Position;
  dragging: Rect;
  axis: Axis;
}

export function getOffsetForCrossAxisEndEdge({
  crossAxisEndEdgeOn,
  dragging,
  axis,
}: ForCrossAxisEnd): Position {
  const offset: Position = subtract(
    crossAxisEndEdgeOn,
    patch(axis.line, dragging.center[axis.line], dragging[axis.crossAxisEnd]),
  );
  return offset;
}
