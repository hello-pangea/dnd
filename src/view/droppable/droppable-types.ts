import type { ReactNode } from 'react';
import type {
  DraggableId,
  DroppableId,
  TypeId,
  Direction,
  Placeholder,
  State,
  ContextId,
  DraggableRubric,
  DroppableMode,
} from '../../types';
import type { ChildrenFn } from '../draggable/draggable-types';
import { updateViewportMaxScroll } from '../../state/action-creators';

export type DraggableChildrenFn = ChildrenFn;

export type DroppableProps = {
  // used for shared global styles
  'data-rfd-droppable-context-id': ContextId;
  // Used to lookup. Currently not used for drag and drop lifecycle
  'data-rfd-droppable-id': DroppableId;
};

export type Provided = {
  innerRef: (a?: HTMLElement | null) => void;
  placeholder: ReactNode | undefined | null;
  droppableProps: DroppableProps;
};

export type UseClone = {
  dragging: DraggableRubric;
  render: DraggableChildrenFn;
};

export type StateSnapshot = {
  // Is the Droppable being dragged over?
  isDraggingOver: boolean;
  // What is the id of the draggable that is dragging over the Droppable?
  draggingOverWith: DraggableId | undefined | null;
  // What is the id of the draggable that is dragging from this list?
  // Useful for styling the home list when not being dragged over
  draggingFromThisWith: DraggableId | undefined | null;
  // Whether or not the placeholder is actively being used.
  // This is useful information when working with virtual lists
  isUsingPlaceholder: boolean;
};

export type MapProps = {
  // placeholder:
  // - used to keep space in the home list during the whole drag and drop
  // - used to make space in foreign lists during a drag
  placeholder: Placeholder | undefined | null;
  shouldAnimatePlaceholder: boolean;
  // snapshot based on redux state to be provided to consumers
  snapshot: StateSnapshot;
  useClone: UseClone | undefined | null;
};

export type DefaultProps = {
  mode: DroppableMode;
  type: TypeId;
  isDropDisabled: boolean;
  isCombineEnabled: boolean;
  direction: Direction;
  renderClone: DraggableChildrenFn | undefined | null;
  ignoreContainerClipping: boolean;
  getContainerForClone: () => HTMLElement;
};

export type DispatchProps = {
  updateViewportMaxScroll: typeof updateViewportMaxScroll;
};

export type OwnProps = {
  children: (b: Provided, a: StateSnapshot) => ReactNode;
  droppableId: DroppableId;
  renderClone: DraggableChildrenFn | undefined | null;
} & DefaultProps;

export type Props = {} & MapProps & DispatchProps & OwnProps;

// Having issues getting the correct type
// export type Selector = OutputSelector<State, OwnProps, MapProps>;
export type Selector = (state: State, ownProps: OwnProps) => MapProps;
