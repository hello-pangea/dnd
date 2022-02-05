import type { Position } from 'css-box-model';
import type {
  Critical,
  DraggableId,
  DroppableId,
  CompletedDrag,
  MovementMode,
  Viewport,
  DimensionMap,
  DropReason,
  Published,
} from '../types';

export type BeforeInitialCaptureArgs = {
  draggableId: DraggableId;
  movementMode: MovementMode;
};

export type BeforeInitialCaptureAction = {
  type: 'BEFORE_INITIAL_CAPTURE';
  payload: BeforeInitialCaptureArgs;
};

export type BeforeInitialCaptureActionCreator = typeof beforeInitialCapture;

export const beforeInitialCapture = (
  args: BeforeInitialCaptureArgs,
): BeforeInitialCaptureAction => ({
  type: 'BEFORE_INITIAL_CAPTURE',
  payload: args,
});

export type LiftArgs = {
  // lifting with DraggableId rather than descriptor
  // as the descriptor might change after a drop is flushed
  id: DraggableId;
  clientSelection: Position;
  movementMode: MovementMode;
};

export type LiftAction = {
  type: 'LIFT';
  payload: LiftArgs;
};

export type LiftActionCreator = typeof lift;

export const lift = (args: LiftArgs): LiftAction => ({
  type: 'LIFT',
  payload: args,
});

export type InitialPublishArgs = {
  critical: Critical;
  dimensions: DimensionMap;
  clientSelection: Position;
  viewport: Viewport;
  movementMode: MovementMode;
};

export type InitialPublishAction = {
  type: 'INITIAL_PUBLISH';
  payload: InitialPublishArgs;
};

export type InitialPublishActionCreator = typeof initialPublish;

export const initialPublish = (
  args: InitialPublishArgs,
): InitialPublishAction => ({
  type: 'INITIAL_PUBLISH',
  payload: args,
});

export type PublishWhileDraggingAction = {
  type: 'PUBLISH_WHILE_DRAGGING';
  payload: Published;
};

export type PublishWhileDraggingArgs = Published;

export type PublishWhileDraggingActionCreator = typeof publishWhileDragging;

export const publishWhileDragging = (
  args: PublishWhileDraggingArgs,
): PublishWhileDraggingAction => ({
  type: 'PUBLISH_WHILE_DRAGGING',
  payload: args,
});

export type CollectionStartingAction = {
  type: 'COLLECTION_STARTING';
  payload: null;
};

export type CollectionStartingActionCreator = typeof collectionStarting;

export const collectionStarting = (): CollectionStartingAction => ({
  type: 'COLLECTION_STARTING',
  payload: null,
});

export type UpdateDroppableScrollArgs = {
  id: DroppableId;
  newScroll: Position;
};

export type UpdateDroppableScrollAction = {
  type: 'UPDATE_DROPPABLE_SCROLL';
  payload: UpdateDroppableScrollArgs;
};

export type UpdateDroppableScrollActionCreator = typeof updateDroppableScroll;

export const updateDroppableScroll = (
  args: UpdateDroppableScrollArgs,
): UpdateDroppableScrollAction => ({
  type: 'UPDATE_DROPPABLE_SCROLL',
  payload: args,
});

export type UpdateDroppableIsEnabledArgs = {
  id: DroppableId;
  isEnabled: boolean;
};

export type UpdateDroppableIsEnabledAction = {
  type: 'UPDATE_DROPPABLE_IS_ENABLED';
  payload: UpdateDroppableIsEnabledArgs;
};

export type UpdateDroppableIsEnabledActionCreator = typeof updateDroppableIsEnabled;

export const updateDroppableIsEnabled = (
  args: UpdateDroppableIsEnabledArgs,
): UpdateDroppableIsEnabledAction => ({
  type: 'UPDATE_DROPPABLE_IS_ENABLED',
  payload: args,
});

export type UpdateDroppableIsCombineEnabledArgs = {
  id: DroppableId;
  isCombineEnabled: boolean;
};

export type UpdateDroppableIsCombineEnabledAction = {
  type: 'UPDATE_DROPPABLE_IS_COMBINE_ENABLED';
  payload: UpdateDroppableIsCombineEnabledArgs;
};

export type UpdateDroppableIsCombineEnabledActionCreator = typeof updateDroppableIsCombineEnabled;

export const updateDroppableIsCombineEnabled = (
  args: UpdateDroppableIsCombineEnabledArgs,
): UpdateDroppableIsCombineEnabledAction => ({
  type: 'UPDATE_DROPPABLE_IS_COMBINE_ENABLED',
  payload: args,
});

export type MoveArgs = {
  client: Position;
};

export type MoveAction = {
  type: 'MOVE';
  payload: MoveArgs;
};

export type MoveActionCreator = typeof move;

export const move = (args: MoveArgs): MoveAction => ({
  type: 'MOVE',
  payload: args,
});

type MoveByWindowScrollArgs = {
  newScroll: Position;
};

export type MoveByWindowScrollAction = {
  type: 'MOVE_BY_WINDOW_SCROLL';
  payload: MoveByWindowScrollArgs;
};

export type MoveByWindowScrollActionCreator = typeof moveByWindowScroll;

export const moveByWindowScroll = (
  args: MoveByWindowScrollArgs,
): MoveByWindowScrollAction => ({
  type: 'MOVE_BY_WINDOW_SCROLL',
  payload: args,
});

export type UpdateViewportMaxScrollArgs = {
  maxScroll: Position;
};

export type UpdateViewportMaxScrollAction = {
  type: 'UPDATE_VIEWPORT_MAX_SCROLL';
  payload: UpdateViewportMaxScrollArgs;
};

export type UpdateViewportMaxScrollActionCreator = typeof updateViewportMaxScroll;

export const updateViewportMaxScroll = (
  args: UpdateViewportMaxScrollArgs,
): UpdateViewportMaxScrollAction => ({
  type: 'UPDATE_VIEWPORT_MAX_SCROLL',
  payload: args,
});

export type MoveUpAction = {
  type: 'MOVE_UP';
  payload: null;
};

export type MoveUpActionCreator = typeof moveUp;

export const moveUp = (): MoveUpAction => ({
  type: 'MOVE_UP',
  payload: null,
});

export type MoveDownAction = {
  type: 'MOVE_DOWN';
  payload: null;
};

export type MoveDownActionCreator = typeof moveDown;

export const moveDown = (): MoveDownAction => ({
  type: 'MOVE_DOWN',
  payload: null,
});

export type MoveRightAction = {
  type: 'MOVE_RIGHT';
  payload: null;
};

export type MoveRightActionCreator = typeof moveRight;

export const moveRight = (): MoveRightAction => ({
  type: 'MOVE_RIGHT',
  payload: null,
});

export type MoveLeftAction = {
  type: 'MOVE_LEFT';
  payload: null;
};

export type MoveLeftActionCreator = typeof moveLeft;

export const moveLeft = (): MoveLeftAction => ({
  type: 'MOVE_LEFT',
  payload: null,
});

export type FlushAction = {
  type: 'FLUSH';
  payload: null;
};

export type FlushActionCreator = typeof flush;

export const flush = (): FlushAction => ({
  type: 'FLUSH',
  payload: null,
});

export type AnimateDropArgs = {
  completed: CompletedDrag;
  newHomeClientOffset: Position;
  dropDuration: number;
};

export type DropAnimateAction = {
  type: 'DROP_ANIMATE';
  payload: AnimateDropArgs;
};

export type AnimateDropActionCreator = typeof animateDrop;

export const animateDrop = (args: AnimateDropArgs): DropAnimateAction => ({
  type: 'DROP_ANIMATE',
  payload: args,
});

export type DropCompleteArgs = {
  completed: CompletedDrag;
};

export type DropCompleteAction = {
  type: 'DROP_COMPLETE';
  payload: DropCompleteArgs;
};

export type CompleteDropActionCreator = typeof completeDrop;

export const completeDrop = (args: DropCompleteArgs): DropCompleteAction => ({
  type: 'DROP_COMPLETE',
  payload: args,
});

type DropArgs = {
  reason: DropReason;
};

export type DropAction = {
  type: 'DROP';
  payload: DropArgs;
};

export type DropActionCreator = typeof drop;

export const drop = (args: DropArgs): DropAction => ({
  type: 'DROP',
  payload: args,
});

export type CancelActionCreator = typeof cancel;

export const cancel = () => drop({ reason: 'CANCEL' });

export type DropPendingAction = {
  type: 'DROP_PENDING';
  payload: DropArgs;
};

export type DropPendingActionCreator = typeof dropPending;

export const dropPending = (args: DropArgs): DropPendingAction => ({
  type: 'DROP_PENDING',
  payload: args,
});

export type DropAnimationFinishedAction = {
  type: 'DROP_ANIMATION_FINISHED';
  payload: null;
};

export type DropAnimationFinishedActionCreator = typeof dropAnimationFinished;

export const dropAnimationFinished = (): DropAnimationFinishedAction => ({
  type: 'DROP_ANIMATION_FINISHED',
  payload: null,
});

export type Action =
  | BeforeInitialCaptureAction
  | LiftAction
  | InitialPublishAction
  | PublishWhileDraggingAction
  | CollectionStartingAction
  | UpdateDroppableScrollAction
  | UpdateDroppableIsEnabledAction
  | UpdateDroppableIsCombineEnabledAction
  | MoveByWindowScrollAction // | PostJumpScrollAction
  // | PostSnapDestinationChangeAction
  | UpdateViewportMaxScrollAction
  | MoveAction
  | MoveUpAction
  | MoveDownAction
  | MoveRightAction
  | MoveLeftAction
  | DropPendingAction
  | DropAction
  | DropAnimateAction
  | DropAnimationFinishedAction
  | DropCompleteAction
  | FlushAction;

export type ActionCreator =
  | BeforeInitialCaptureActionCreator
  | LiftActionCreator
  | InitialPublishActionCreator
  | PublishWhileDraggingActionCreator
  | CollectionStartingActionCreator
  | UpdateDroppableScrollActionCreator
  | UpdateDroppableIsEnabledActionCreator
  | UpdateDroppableIsCombineEnabledActionCreator
  | MoveActionCreator
  | MoveByWindowScrollActionCreator
  | UpdateViewportMaxScrollActionCreator
  | MoveUpActionCreator
  | MoveDownActionCreator
  | MoveRightActionCreator
  | MoveLeftActionCreator
  | FlushActionCreator
  | AnimateDropActionCreator
  | CompleteDropActionCreator
  | DropActionCreator
  | CancelActionCreator
  | DropPendingActionCreator
  | DropAnimationFinishedActionCreator;
