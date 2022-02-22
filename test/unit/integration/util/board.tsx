import React from 'react';
import type { BoxModel } from 'css-box-model';
import { invariant } from '../../../../src/invariant';
import * as attributes from '../../../../src/view/data-attributes';
import { DragDropContext, Droppable, Draggable } from '../../../../src';
import type {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from '../../../../src';
import type {
  DroppableDescriptor,
  DraggableDescriptor,
  DraggableId,
  DroppableId,
} from '../../../../src/types';
import { noop } from '../../../../src/empty';
import { getComputedSpacing, getPreset } from '../../../util/dimension';
import { toDroppableList } from '../../../../src/state/dimension-structures';
import getDraggablesInsideDroppable from '../../../../src/state/get-draggables-inside-droppable';
import setDOMRect from '../../../util/set-dom-rect';

const preset = getPreset();

interface CardProps {
  index: number;
  descriptor: DraggableDescriptor;
}

function Card(props: CardProps) {
  return (
    <Draggable draggableId={props.descriptor.id} index={props.index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          data-testid={props.descriptor.id}
          data-is-dragging={snapshot.isDragging}
          data-is-over={snapshot.draggingOver}
        />
      )}
    </Draggable>
  );
}

interface ColumnProps {
  index: number;
  descriptor: DroppableDescriptor;
}

function Column(props: ColumnProps) {
  return (
    <Draggable draggableId={props.descriptor.id} index={props.index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          data-testid={props.descriptor.id}
          data-is-dragging={snapshot.isDragging}
        >
          <Droppable
            droppableId={props.descriptor.id}
            type={props.descriptor.type}
          >
            {(droppableProvided: DroppableProvided) => (
              <div
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
              >
                {getDraggablesInsideDroppable(
                  props.descriptor.id,
                  preset.draggables,
                ).map((draggable, index) => (
                  <Card
                    key={draggable.descriptor.id}
                    descriptor={draggable.descriptor}
                    index={index}
                  />
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default function Board() {
  return (
    <DragDropContext onDragEnd={noop}>
      <Droppable droppableId="BOARD" type="BOARD" direction="horizontal">
        {(provided: DroppableProvided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {toDroppableList(preset.droppables).map((droppable, index) => (
              <Column
                key={droppable.descriptor.id}
                descriptor={droppable.descriptor}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export function withPoorBoardDimensions(fn: (a: typeof preset) => void): void {
  const protoSpy = jest
    .spyOn(Element.prototype, 'getBoundingClientRect')
    .mockImplementation(function fake(this: HTMLElement) {
      invariant(
        this instanceof HTMLElement,
        'Expected "this" to be a HTMLElement',
      );

      const droppableId: DroppableId | null = this.getAttribute(
        attributes.droppable.id,
      );
      if (droppableId) {
        return setDOMRect(preset.droppables[droppableId].client.borderBox);
      }

      const draggableId: DraggableId | null = this.getAttribute(
        attributes.draggable.id,
      );
      invariant(draggableId, 'Expected element to be a draggable');

      return setDOMRect(preset.draggables[draggableId].client.borderBox);
    });

  // Stubbing out totally - not including margins in this
  const styleSpy = jest
    .spyOn(window, 'getComputedStyle')
    .mockImplementation(function fake(el: Element) {
      function getSpacing(box: BoxModel) {
        return getComputedSpacing({
          margin: box.margin,
          padding: box.padding,
          border: box.border,
        });
      }

      const droppableId: DroppableId | null = el.getAttribute(
        attributes.droppable.id,
      );

      if (droppableId) {
        if (droppableId === 'BOARD') {
          return getComputedSpacing({}) as CSSStyleDeclaration;
        }

        return getSpacing(
          preset.droppables[droppableId].client,
        ) as CSSStyleDeclaration;
      }

      const draggableId: DraggableId | null = el.getAttribute(
        attributes.draggable.id,
      );

      // this can be the case when looking up the tree for a scroll container
      if (!draggableId) {
        return getComputedSpacing({}) as CSSStyleDeclaration;
      }

      if (preset.draggables[draggableId]) {
        return getSpacing(
          preset.draggables[draggableId].client,
        ) as CSSStyleDeclaration;
      }

      // columns are also draggables for our example
      if (preset.droppables[draggableId]) {
        return getSpacing(
          preset.droppables[draggableId].client,
        ) as CSSStyleDeclaration;
      }

      throw new Error(`Unable to find spacing for draggable: ${draggableId}`);
    });

  try {
    fn(preset);
  } finally {
    protoSpy.mockRestore();
    styleSpy.mockRestore();
  }
}
