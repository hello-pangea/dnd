import React from 'react';
import { render } from '@testing-library/react';
import { DragDropContext, Droppable, Draggable } from '../../../../src';
import type { DroppableProvided, DraggableProvided } from '../../../../src';

let consoleErrorSpy: jest.SpyInstance;
let consoleWarnSpy: jest.SpyInstance;

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockRestore();
});

type Props = {
  draggableId: any;
  index: any;
};

function WithCustomProps(props: Props) {
  return (
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="droppable">
        {(droppableProvided: DroppableProvided) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            <Draggable draggableId={props.draggableId} index={props.index}>
              {(provided: DraggableProvided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  Drag me!
                </div>
              )}
            </Draggable>
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

it('should log an error if draggableId is not a string', () => {
  [1, undefined, false, {}].forEach((value: unknown) => {
    const { unmount } = render(
      <WithCustomProps draggableId={value} index={0} />,
    );

    expect(consoleErrorSpy).toHaveBeenCalled();

    unmount();
    consoleErrorSpy.mockClear();
  });
});

it('should log an error if index is not an integer', () => {
  ['1', 1.33, undefined, false, {}].forEach((value: unknown) => {
    const { unmount } = render(
      <WithCustomProps draggableId="draggable" index={value} />,
    );

    expect(consoleErrorSpy).toHaveBeenCalled();

    unmount();
    consoleErrorSpy.mockClear();
  });
});

it('should log an error if innerRef is not provided', () => {
  function App() {
    return (
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="droppable">
          {(droppableProvided: DroppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              <Draggable draggableId="draggable" index={0}>
                {(provided: DraggableProvided) => (
                  <div
                    /* not providing a ref */
                    /* ref={provided.innerRef} */
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    Drag me!
                  </div>
                )}
              </Draggable>
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  render(<App />);

  expect(consoleErrorSpy).toHaveBeenCalled();
});

it('should log an error if innerRef is an SVG', () => {
  function App() {
    return (
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="droppable">
          {(droppableProvided: DroppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              <Draggable draggableId="draggable" index={0}>
                {(provided: DraggableProvided) => (
                  <svg
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    // TypeScript is correctly stating this is not a HTMLElement
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    Drag me!
                  </svg>
                )}
              </Draggable>
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  render(<App />);

  expect(consoleErrorSpy).toHaveBeenCalled();
});

it('should log an error if no drag handle props are applied', () => {
  function App() {
    return (
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="droppable">
          {(droppableProvided: DroppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              <Draggable draggableId="draggable" index={0}>
                {(provided: DraggableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    /* not being applied */
                    /* {...dragProvided.dragHandleProps} */
                  >
                    Drag me!
                  </div>
                )}
              </Draggable>
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  render(<App />);

  expect(consoleErrorSpy).toHaveBeenCalled();
});

it('should log an error if the draggable is disabled as there will be no drag handle', () => {
  function App() {
    return (
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="droppable">
          {(droppableProvided: DroppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              <Draggable draggableId="draggable" index={0} isDragDisabled>
                {(provided: DraggableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    Drag me!
                  </div>
                )}
              </Draggable>
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  consoleErrorSpy.mockRestore();
  render(<App />);

  expect(consoleErrorSpy).not.toHaveBeenCalled();
});
