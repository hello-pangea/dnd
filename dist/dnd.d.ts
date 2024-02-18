import { Position } from 'css-box-model';
import React, { ReactNode, TransitionEventHandler, DragEventHandler, FunctionComponent } from 'react';

type Id = string;
type DraggableId = Id;
type DroppableId = Id;
type TypeId = Id;
type ContextId = Id;
type ElementId = Id;
type DroppableMode = 'standard' | 'virtual';
interface DraggableOptions {
    canDragInteractiveElements: boolean;
    shouldRespectForcePress: boolean;
    isEnabled: boolean;
}
type Direction = 'horizontal' | 'vertical';
interface DraggableLocation {
    droppableId: DroppableId;
    index: number;
}
interface Combine {
    draggableId: DraggableId;
    droppableId: DroppableId;
}
type MovementMode = 'FLUID' | 'SNAP';
interface DraggableRubric {
    draggableId: DraggableId;
    type: TypeId;
    source: DraggableLocation;
}
interface BeforeCapture {
    draggableId: DraggableId;
    mode: MovementMode;
}
interface DragStart extends DraggableRubric {
    mode: MovementMode;
}
interface DragUpdate extends DragStart {
    destination: DraggableLocation | null;
    combine: Combine | null;
}
type DropReason = 'DROP' | 'CANCEL';
interface DropResult extends DragUpdate {
    reason: DropReason;
}
type Announce = (message: string) => void;
interface ResponderProvided {
    announce: Announce;
}
type OnBeforeCaptureResponder = (before: BeforeCapture) => void;
type OnBeforeDragStartResponder = (start: DragStart) => void;
type OnDragStartResponder = (start: DragStart, provided: ResponderProvided) => void;
type OnDragUpdateResponder = (update: DragUpdate, provided: ResponderProvided) => void;
type OnDragEndResponder = (result: DropResult, provided: ResponderProvided) => void;
interface Responders {
    onBeforeCapture?: OnBeforeCaptureResponder;
    onBeforeDragStart?: OnBeforeDragStartResponder;
    onDragStart?: OnDragStartResponder;
    onDragUpdate?: OnDragUpdateResponder;
    onDragEnd: OnDragEndResponder;
}
interface StopDragOptions {
    shouldBlockNextClick: boolean;
}
interface DragActions {
    drop: (args?: StopDragOptions) => void;
    cancel: (args?: StopDragOptions) => void;
    isActive: () => boolean;
    shouldRespectForcePress: () => boolean;
}
interface FluidDragActions extends DragActions {
    move: (clientSelection: Position) => void;
}
interface SnapDragActions extends DragActions {
    moveUp: () => void;
    moveDown: () => void;
    moveRight: () => void;
    moveLeft: () => void;
}
interface PreDragActions {
    isActive: () => boolean;
    shouldRespectForcePress: () => boolean;
    fluidLift: (clientSelection: Position) => FluidDragActions;
    snapLift: () => SnapDragActions;
    abort: () => void;
}
interface TryGetLockOptions {
    sourceEvent?: Event;
}
type TryGetLock = (draggableId: DraggableId, forceStop?: () => void, options?: TryGetLockOptions) => PreDragActions | null;
interface SensorAPI {
    tryGetLock: TryGetLock;
    canGetLock: (id: DraggableId) => boolean;
    isLockClaimed: () => boolean;
    tryReleaseLock: () => void;
    findClosestDraggableId: (event: Event) => DraggableId | null;
    findOptionsForDraggable: (id: DraggableId) => DraggableOptions | null;
}
type Sensor = (api: SensorAPI) => void;

type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends (...args: any) => any ? T[P] | undefined : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

/**
 * Customize autoScroller behavior
 */
interface AutoScrollerOptions {
    /**
     * Percentage distance from edge of container at which to start auto scrolling.
     * ex. 0.1 or 0.9
     */
    startFromPercentage: number;
    /**
     * Percentage distance from edge of container at which max scroll speed is achieved.
     * Should be less than startFromPercentage
     */
    maxScrollAtPercentage: number;
    /**
     * Maximum pixels to scroll per frame
     */
    maxPixelScroll: number;
    /**
     * A function used to ease a percentage value
     * A simple linear function would be: (percentage) => percentage;
     * percentage is between 0 and 1
     * result must be between 0 and 1
     */
    ease: (percentage: number) => number;
    durationDampening: {
        /**
         * How long to dampen the speed of an auto scroll from the start of a drag in milliseconds
         */
        stopDampeningAt: number;
        /**
         * When to start accelerating the reduction of duration dampening in milliseconds
         */
        accelerateAt: number;
    };
    /**
     * Whether or not autoscroll should be turned off entirely
     */
    disabled: boolean;
}
type PartialAutoScrollerOptions = RecursivePartial<AutoScrollerOptions>;

interface DragDropContextProps extends Responders {
    children: ReactNode | null;
    dragHandleUsageInstructions?: string;
    enableDefaultSensors?: boolean | null;
    nonce?: string;
    sensors?: Sensor[];
    /**
     * Customize auto scroller
     */
    autoScrollerOptions?: PartialAutoScrollerOptions;
}
declare function resetServerContext(): void;
declare function DragDropContext(props: DragDropContextProps): React.JSX.Element;

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
type DraggableStyle = DraggingStyle | NotDraggingStyle;
interface DraggableProvidedDraggableProps {
    style?: DraggableStyle;
    'data-rfd-draggable-context-id': ContextId;
    'data-rfd-draggable-id': DraggableId;
    onTransitionEnd?: TransitionEventHandler;
}
interface DraggableProvidedDragHandleProps {
    'data-rfd-drag-handle-draggable-id': DraggableId;
    'data-rfd-drag-handle-context-id': ContextId;
    role: string;
    'aria-describedby': ElementId;
    tabIndex: number;
    draggable: boolean;
    onDragStart: DragEventHandler;
}
interface DraggableProvided {
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null;
    innerRef: (element?: HTMLElement | null) => void;
}
interface DropAnimation {
    duration: number;
    curve: string;
    moveTo: Position;
    opacity: number | null;
    scale: number | null;
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
type DraggableChildrenFn = (provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubic: DraggableRubric) => ReactNode | null;
interface DraggableProps {
    draggableId: DraggableId;
    index: number;
    children: DraggableChildrenFn;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    shouldRespectForcePress?: boolean;
}

declare function PublicDraggable(props: DraggableProps): React.JSX.Element;

interface DroppableProvidedProps {
    'data-rfd-droppable-context-id': ContextId;
    'data-rfd-droppable-id': DroppableId;
}
interface DroppableProvided {
    innerRef: (a?: HTMLElement | null) => void;
    placeholder: ReactNode | null;
    droppableProps: DroppableProvidedProps;
}
interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith: DraggableId | null;
    draggingFromThisWith: DraggableId | null;
    isUsingPlaceholder: boolean;
}
interface DefaultProps {
    direction: Direction;
    getContainerForClone: () => HTMLElement;
    ignoreContainerClipping: boolean;
    isCombineEnabled: boolean;
    isCombineOnly: boolean;
    isDropDisabled: boolean;
    mode: DroppableMode;
    type: TypeId;
    renderClone: DraggableChildrenFn | null;
}
interface DroppableProps extends Partial<DefaultProps> {
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => ReactNode;
    droppableId: DroppableId;
    renderClone?: DraggableChildrenFn | null;
}

declare const ConnectedDroppable: FunctionComponent<DroppableProps>;

declare function useMouseSensor(api: SensorAPI): void;

declare function useTouchSensor(api: SensorAPI): void;

declare function useKeyboardSensor(api: SensorAPI): void;

export { Announce, BeforeCapture, Direction, DragDropContext, DragDropContextProps, DragStart, DragUpdate, PublicDraggable as Draggable, DraggableChildrenFn, DraggableId, DraggableLocation, DraggableProps, DraggableProvided, DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps, DraggableRubric, DraggableStateSnapshot, DraggableStyle, DraggingStyle, DropAnimation, DropResult, ConnectedDroppable as Droppable, DroppableId, DroppableProps, DroppableProvided, DroppableProvidedProps, DroppableStateSnapshot, FluidDragActions, Id, MovementMode, NotDraggingStyle, OnBeforeCaptureResponder, OnBeforeDragStartResponder, OnDragEndResponder, OnDragStartResponder, OnDragUpdateResponder, PreDragActions, ResponderProvided, Sensor, SensorAPI, SnapDragActions, TryGetLock, TryGetLockOptions, TypeId, resetServerContext, useKeyboardSensor, useMouseSensor, useTouchSensor };
