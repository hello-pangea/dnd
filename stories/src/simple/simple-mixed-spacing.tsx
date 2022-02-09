import React, { Component } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableStyle,
  DropResult,
} from '../../../src';

// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = <TList extends unknown[]>(
  list: TList,
  startIndex: number,
  endIndex: number,
): TList => {
  const result = Array.from(list) as TList;
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const withAssortedSpacing = () => ({
  // margin
  marginTop: 10,
  // not allowing margin collapsing
  // marginBottom: 20,
  marginLeft: 30,
  marginRight: 40,
  // padding
  paddingTop: 10,
  paddingBottom: 20,
  paddingLeft: 30,
  paddingRight: 40,
  // border
  borderStyle: 'solid',
  borderColor: 'purple',
  borderTopWidth: 2,
  borderBottomWidth: 4,
  borderLeftWidth: 6,
  borderRightWidth: 8,
});

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggableStyle = {},
) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none' as const,
  ...withAssortedSpacing(),

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'pink',

  // styles we need to apply on draggables
  ...draggableStyle,
});

interface AppProps {}

interface Item {
  id: string;
  content: string;
}

interface AppState {
  items: Item[];
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      items: getItems(10),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result: DropResult) {
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
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              style={{
                width: 250,
                background: 'lightblue',

                ...withAssortedSpacing(),
                // no margin collapsing
                marginTop: 0,
              }}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(draggableProvided, draggableSnapshot) => (
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
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
