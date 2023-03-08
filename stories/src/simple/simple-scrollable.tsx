import React, { Component } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableStyle,
  DropResult,
} from '@hello-pangea/dnd';

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

const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggableStyle = {},
) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none' as const,
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  border: '5px solid yellow',
  height: 30,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'red',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean, overflow?: string) => ({
  background: isDraggingOver ? 'lightblue' : 'grey',
  padding: grid,
  border: '5px solid pink',
  width: 250,
  maxHeight: '50vh',
  overflow,
});

interface AppProps {
  overflow?: string;
  stylesRoot?: HTMLElement | null;
}

interface Item {
  id: string;
  content: string;
}

interface AppState {
  items: Item[];
}

export default class App extends Component<AppProps, AppState> {
  static defaultProps = {
    overflow: 'auto',
  };

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
      <DragDropContext onDragEnd={this.onDragEnd} stylesInsertionPoint={this.props.stylesRoot}>
        <Droppable droppableId="droppable">
          {(droppableProvided, droppableSnapshot) => (
            <div
              ref={droppableProvided.innerRef}
              style={getListStyle(
                droppableSnapshot.isDraggingOver,
                this.props.overflow,
              )}
              onScroll={(e) =>
                // eslint-disable-next-line no-console
                console.log('current scrollTop', e.currentTarget.scrollTop)
              }
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
