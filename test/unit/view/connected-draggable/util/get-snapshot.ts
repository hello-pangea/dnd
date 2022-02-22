import type {
  DraggableStateSnapshot,
  DropAnimation,
} from '../../../../../src/view/draggable/draggable-types';
import type {
  MovementMode,
  DroppableId,
  DraggableId,
} from '../../../../../src/types';

interface GetDraggingSnapshotArgs {
  mode: MovementMode;
  draggingOver: DroppableId | null;
  combineWith: DraggableId | null;
  dropping: DropAnimation | null;
  isClone?: boolean | null;
}

export const getDraggingSnapshot = ({
  mode,
  draggingOver,
  combineWith,
  dropping,
  isClone,
}: GetDraggingSnapshotArgs): DraggableStateSnapshot => ({
  isDragging: true,
  isDropAnimating: Boolean(dropping),
  dropAnimation: dropping,
  mode,
  draggingOver,
  combineWith,
  combineTargetFor: null,
  isClone: Boolean(isClone),
});

interface GetSecondarySnapshotArgs {
  combineTargetFor: DraggableId | null;
}

export const getSecondarySnapshot = ({
  combineTargetFor,
}: GetSecondarySnapshotArgs): DraggableStateSnapshot => ({
  isDragging: false,
  isClone: false,
  isDropAnimating: false,
  dropAnimation: null,
  mode: null,
  draggingOver: null,
  combineTargetFor,
  combineWith: null,
});
