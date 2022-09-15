# Types

## Typescript

If you are using [TypeScript](https://www.typescriptlang.org/) you are covered! Our codebase is using TypeScript. The type definitions are bundled with this package, so it should works out-of-the-box!

### Ids

```ts
type Id = string;
type DraggableId = Id;
type DroppableId = Id;
type TypeId = Id;
type ContextId = Id;
type ElementId = Id;
```

### Responders

```ts
interface Responders {
  // optional
  onBeforeCapture?: OnBeforeCaptureResponder;
  onBeforeDragStart?: OnBeforeDragStartResponder;
  onDragStart?: OnDragStartResponder;
  onDragUpdate?: OnDragUpdateResponder;

  // required
  onDragEnd: OnDragEndResponder;
}

type OnBeforeCaptureResponder = (before: BeforeCapture) => unknown;

type OnBeforeDragStartResponder = (start: DragStart) => unknown;

type OnDragStartResponder = (start: DragStart, provided: ResponderProvided) => unknown;

type OnDragUpdateResponder = (update: DragUpdate, provided: ResponderProvided) => unknown;

type OnDragEndResponder = (result: DropResult, provided: ResponderProvided) => unknown;

interface DraggableRubric {
  draggableId: DraggableId;
  type: TypeId;
  source: DraggableLocation;
}

interface DragStart extends DraggableRubric {
    mode: MovementMode;
}


interface DragUpdate extends DragStart {
  // populated if in a reorder position
  destination: DraggableLocation | null;
  // populated if combining with another draggable
  combine: Combine | null;
}

// details about the draggable that is being combined with
interface Combine {
  draggableId: DraggableId;
  droppableId: DroppableId;
}

interface DropResult extends DragUpdate {
    reason: DropReason;
}

type DropReason = 'DROP' | 'CANCEL';

interface DraggableLocation {
  droppableId: DroppableId;
  // the position of the droppable within a droppable
  index: number;
}

// There are two modes that a drag can be in
// FLUID: everything is done in response to highly granular input (eg mouse)
// SNAP: items snap between positions (eg keyboard);
type MovementMode = 'FLUID' | 'SNAP';
```

### Sensors

```ts
type Sensor = (api: SensorAPI) => void;
interface SensorAPI {
  tryGetLock: TryGetLock;
  canGetLock: (id: DraggableId) => boolean;
  isLockClaimed: () => boolean;
  tryReleaseLock: () => void;
  findClosestDraggableId: (event: Event) => DraggableId | null;
  findOptionsForDraggable: (id: DraggableId) => DraggableOptions | null;
}
type TryGetLock = (
  draggableId: DraggableId,
  forceStop?: () => void,
  options?: TryGetLockOptions
) => PreDragActions | null;
interface TryGetLockOptions {
  sourceEvent?: Event;
}
```

### Droppable

```ts
interface DroppableProvided {
  innerRef: (a?: HTMLElement | null) => void;
  placeholder: ReactNode | null;
  droppableProps: DroppableProps;
}
interface DroppableProps {
  // used for shared global styles
  'data-rfd-droppable-context-id': ContextId;
  // Used to lookup. Currently not used for drag and drop lifecycle
  'data-rfd-droppable-id': DroppableId;
}
interface DroppableStateSnapshot {
  isDraggingOver: boolean;
  draggingOverWith: DraggableId | null;
  draggingFromThisWith: DraggableId | null;
  isUsingPlaceholder: boolean;
}
```

### Draggable

```ts
interface DraggableProvided {
  draggableProps: DraggableProps;
  dragHandleProps: DragHandleProps | null;
  innerRef: (a?: HTMLElement | null) => void;
}

interface DraggableStateSnapshot {
  isDragging: boolean;
  isDropAnimating: boolean;
  isClone: boolean;
  dropAnimation: DropAnimation | null;
  draggingOver: DroppableId | null;
  combineWith: DraggableId | null;
  combineTargetFor: DraggableId | null;
  mode: MovementMode | null;
}

interface DraggableProps {
  style?: DraggableStyle;
  'data-rfd-draggable-context-id': ContextId;
  'data-rfd-draggable-id': DraggableId;
  onTransitionEnd?: TransitionEventHandler;
}

type DraggableChildrenFn = (
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableRubric,
) => ReactNode | null;

type DraggableStyle = DraggingStyle | NotDraggingStyle;
interface DraggingStyle {
  position: 'fixed';
  top: number;
  left: number;
  boxSizing: 'border-box';
  width: number;
  height: number;
  transition: string;
  transform?: string;
  zIndex: number;
  opacity?: number;
  pointerEvents: 'none';
}
interface NotDraggingStyle {
  transform?: string;
  transition?: 'none';
}

interface DragHandleProps {
  'data-rfd-drag-handle-draggable-id': DraggableId;
  'data-rfd-drag-handle-context-id': ContextId;
  role: string;
  'aria-describedby': ElementId;
  tabIndex: number;
  draggable: boolean;
  onDragStart: DragEventHandler;
}

interface DropAnimation {
  duration: number;
  curve: string;
  moveTo: Position;
  opacity: number | null;
  scale: number | null;
}
```

## Using the TypeScript types

The types are exported as part of the module so using them is as simple as:

```js
import type { DroppableProvided } from '@hello-pangea/dnd';
```

[← Back to documentation](/README.md#documentation-)
