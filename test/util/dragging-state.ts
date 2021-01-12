import type { Position } from 'css-box-model';
import { add } from '../../src/state/position';
import getStatePreset from './get-simple-state-preset';
import type {
  ClientPositions,
  PagePositions,
  DraggingState,
  CollectingState,
  DropPendingState,
  DragImpact,
} from '../../src/types';

const state = getStatePreset();

export type IsDraggingState =
  | DraggingState
  | CollectingState
  | DropPendingState;

export const draggingStates: IsDraggingState[] = [
  state.dragging(),
  state.collecting(),
  state.dropPending(),
];

export const withImpact = (
  current: IsDraggingState,
  impact: DragImpact,
): IsDraggingState =>
  ({
    ...current,
    impact,
  } as any);

export const move = (
  previous: IsDraggingState,
  offset: Position,
): IsDraggingState => {
  const client: ClientPositions = {
    offset,
    selection: add(previous.initial.client.selection, offset),
    borderBoxCenter: add(previous.initial.client.borderBoxCenter, offset),
  };
  const page: PagePositions = {
    selection: add(client.selection, previous.viewport.scroll.current),
    borderBoxCenter: add(
      client.borderBoxCenter,
      previous.viewport.scroll.current,
    ),
    offset: add(client.offset, previous.viewport.scroll.diff.value),
  };

  return {
    // appeasing flow
    phase: 'DRAGGING',
    ...previous,
    // eslint-disable-next-line
    phase: previous.phase,
    current: {
      client,
      page,
    },
  };
};
