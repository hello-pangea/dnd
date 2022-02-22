import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from '../src';

import type {
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from '../src';

interface Item {
  id: string;
  content: string;
}

// fake data generator
const getItems = (count: number): Item[] =>
  // eslint-disable-next-line no-restricted-syntax
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
function reorder<TItem>(
  list: TItem[],
  startIndex: number,
  endIndex: number,
): TItem[] {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none' as const,
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  overflow: 'auto',
});

interface State {
  items: Item[];
  isDropDisabled: boolean;
}

class App extends React.Component<unknown, State> {
  state: State = {
    items: getItems(6),
    isDropDisabled: false,
  };

  onDragStart = () => {
    this.setState({ isDropDisabled: !this.state.isDropDisabled });
  };

  onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index,
    );

    this.setState({
      items,
    });
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Droppable
          droppableId="droppable"
          isDropDisabled={this.state.isDropDisabled}
        >
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(
                    draggableProvided: DraggableProvided,
                    draggableSnapshot: DraggableStateSnapshot,
                  ) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      style={getItemStyle(
                        draggableSnapshot.isDragging,
                        draggableProvided.draggableProps.style,
                      )}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div style={{ marginTop: grid * 2 }}>
          Is drop disabled? {this.state.isDropDisabled ? 'yes' : 'no'}
        </div>
      </DragDropContext>
    );
  }
}

storiesOf('onDragStart', module).add(
  'toggle isDropDisabled onDragStart',
  () => <App />,
);
