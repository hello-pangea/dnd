import type {
  StateSnapshot,
  DropAnimation,
} from '../../../../../src/view/draggable/draggable-types';
import type {
  MovementMode,
  DroppableId,
  DraggableId,
} from '../../../../../src/types';

type GetDraggingSnapshotArgs = {
  mode: MovementMode;
  draggingOver: DroppableId | undefined | null;
  combineWith: DraggableId | undefined | null;
  dropping: DropAnimation | undefined | null;
  isClone?: boolean | null;
};

export const getDraggingSnapshot = ({
  mode,
  draggingOver,
  combineWith,
  dropping,
  isClone,
}: GetDraggingSnapshotArgs): StateSnapshot => ({
  isDragging: true,
  isDropAnimating: Boolean(dropping),
  dropAnimation: dropping,
  mode,
  draggingOver,
  combineWith,
  combineTargetFor: null,
  isClone: Boolean(isClone),
});

type GetSecondarySnapshotArgs = {
  combineTargetFor: DraggableId | undefined | null;
};

export const getSecondarySnapshot = ({
  combineTargetFor,
}: GetSecondarySnapshotArgs): StateSnapshot => ({
  isDragging: false,
  isClone: false,
  isDropAnimating: false,
  dropAnimation: null,
  mode: null,
  draggingOver: null,
  combineTargetFor,
  combineWith: null,
});
