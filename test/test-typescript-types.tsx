/* eslint-disable no-console */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  DragDropContext,
  Draggable,
  DragStart,
  DragUpdate,
  Droppable,
  DroppableStateSnapshot,
  DropResult,
  resetServerContext,
  ResponderProvided,
} from '../src';

interface Item {
  id: string;
  content: string;
}

const getItems = (count: number): Item[] => {
  return Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));
};

function reorder<TItem>(
  list: TItem[],
  startIndex: number,
  endIndex: number,
): TItem[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const getItemStyle = (
  isDragging: boolean,
  draggableStyle?: React.CSSProperties,
): React.CSSProperties => ({
  userSelect: 'none',
  background: isDragging ? 'lightgreen' : 'grey',
  ...draggableStyle,
});

const getBackgroundColor = (snapshot: DroppableStateSnapshot) => {
  if (snapshot.draggingFromThisWith) {
    return 'lightpink';
  }

  if (snapshot.isDraggingOver) {
    return 'lightblue';
  }

  return 'lightgrey';
};

const getListStyle = (snapshot: DroppableStateSnapshot) => ({
  background: getBackgroundColor(snapshot),
  width: 250,
});

const App: React.FunctionComponent = () => {
  const [items, setItems] = React.useState(getItems(10));

  const onBeforeDragStart = (dragStart: DragStart) => {
    console.log(dragStart);
  };

  const onDragStart = (dragStart: DragStart, provided: ResponderProvided) => {
    console.log(dragStart, provided);
  };

  const onDragUpdate = (
    dragUpdate: DragUpdate,
    provided: ResponderProvided,
  ) => {
    console.log(dragUpdate, provided);
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    console.log(result, provided);

    if (result.combine) {
      // super simple: just removing the dragging item
      const newItems = [...items];
      newItems.splice(result.source.index, 1);
      setItems(newItems);

      return;
    }

    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index,
    );

    setItems(newItems);
  };

  return (
    <DragDropContext
      onBeforeDragStart={onBeforeDragStart}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}
      dragHandleUsageInstructions="Some instruction"
    >
      <Droppable
        droppableId="droppable"
        ignoreContainerClipping={false}
        isCombineEnabled
      >
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            style={getListStyle(droppableSnapshot)}
            {...droppableProvided.droppableProps}
          >
            {items.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}
                shouldRespectForcePress
              >
                {(draggableProvided, draggableSnapshot) => (
                  <div>
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
};

ReactDOM.render(<App />, document.getElementById('app'));

resetServerContext();
