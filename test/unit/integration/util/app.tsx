import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { DragDropContext, Droppable, Draggable } from '../../../../src';

import type {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
  Sensor,
  Direction,
  DraggableRubric,
  DropResult,
  ResponderProvided,
} from '../../../../src';
import { Responders } from '../../../../src/types';

import reorder from '../../../util/reorder';
import { noop } from '../../../../src/empty';

export interface Item {
  id: string;
  // defaults to true
  isEnabled?: boolean;
  // defaults to false
  canDragInteractiveElements?: boolean;
  // defaults to false
  shouldRespectForcePress?: boolean;
}

export type RenderItem = (
  item: Item,
) => (
  provided: DraggableProvided,
  snapshot: DraggableStateSnapshot,
  rubric: DraggableRubric,
) => ReactNode;

export const defaultItemRender: RenderItem =
  (item: Item) =>
  (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={snapshot.isDragging}
      data-is-drop-animating={snapshot.isDropAnimating}
      data-is-combining={Boolean(snapshot.combineWith)}
      data-is-combine-target={Boolean(snapshot.combineTargetFor)}
      data-is-over={snapshot.draggingOver}
      data-is-clone={snapshot.isClone}
      data-testid={item.id}
      ref={provided.innerRef}
    >
      item: {item.id}
    </div>
  );

interface Props extends Partial<Responders> {
  items?: Item[];
  anotherChild?: ReactNode;
  renderItem?: RenderItem;
  // droppable
  direction?: Direction;
  isCombineEnabled?: boolean;
  getContainerForClone?: () => HTMLElement;
  useClone?: boolean;
  sensors?: Sensor[];
  enableDefaultSensors?: boolean;
}

function getItems() {
  return Array.from(
    { length: 3 },
    (v, k): Item => ({
      id: `${k}`,
    }),
  );
}

function withDefaultBool(value: unknown, defaultValue: boolean) {
  if (typeof value === 'boolean') {
    return value;
  }
  return defaultValue;
}

export default function App(props: Props) {
  const [items, setItems] = useState(() => props.items || getItems());
  const onBeforeCapture = props.onBeforeCapture || noop;
  const onBeforeDragStart = props.onBeforeDragStart || noop;
  const onDragStart = props.onDragStart || noop;
  const onDragUpdate = props.onDragUpdate || noop;
  const onDragEndProp = props.onDragEnd;

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (result.destination) {
      const reordered: Item[] = reorder(
        items,
        result.source.index,
        result.destination.index,
      );
      setItems(reordered);
    }

    if (onDragEndProp) {
      onDragEndProp(result, provided);
    }
  };

  const sensors: Sensor[] = props.sensors || [];
  const render: RenderItem = props.renderItem || defaultItemRender;
  const direction: Direction = props.direction || 'vertical';
  const isCombineEnabled: boolean = withDefaultBool(
    props.isCombineEnabled,
    false,
  );
  const renderClone = (() => {
    const useClone: boolean = withDefaultBool(props.useClone, false);
    if (!useClone) {
      return null;
    }

    return function result(
      provided: DraggableProvided,
      snapshot: DraggableStateSnapshot,
      rubric: DraggableRubric,
    ): ReactNode {
      const item: Item = items[rubric.source.index];
      return render(item)(provided, snapshot, rubric);
    };
  })();

  return (
    <main>
      <DragDropContext
        onBeforeCapture={onBeforeCapture}
        onBeforeDragStart={onBeforeDragStart}
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
        sensors={sensors}
        enableDefaultSensors={props.enableDefaultSensors}
      >
        <Droppable
          droppableId="droppable"
          direction={direction}
          isCombineEnabled={isCombineEnabled}
          renderClone={renderClone}
          getContainerForClone={props.getContainerForClone}
        >
          {(droppableProvided: DroppableProvided) => (
            <div
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
            >
              {items.map((item: Item, index: number) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                  isDragDisabled={item.isEnabled === false}
                  disableInteractiveElementBlocking={withDefaultBool(
                    item.canDragInteractiveElements,
                    false,
                  )}
                  shouldRespectForcePress={withDefaultBool(
                    item.shouldRespectForcePress,
                    false,
                  )}
                >
                  {render(item)}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
        {props.anotherChild || null}
      </DragDropContext>
    </main>
  );
}
