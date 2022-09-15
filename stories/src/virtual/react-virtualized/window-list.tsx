import React, { CSSProperties, ReactElement, useState } from 'react';
import ReactDOM from 'react-dom';
import 'react-virtualized/styles.css';
import { WindowScroller, List } from 'react-virtualized';
import { Droppable, Draggable, DragDropContext } from '@hello-pangea/dnd';

import type {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableRubric,
  DropResult,
} from '@hello-pangea/dnd';
import type { Quote } from '../../types';

import QuoteItem from '../../primatives/quote-item';
import reorder from '../../reorder';

interface Props {
  initial: Quote[];
}

interface RowProps {
  index: number;
  style: CSSProperties;
}

// Using a higher order function so that we can look up the quotes data to retrieve
// our quote from within the rowRender function
const getRowRender =
  (quotes: Quote[]) =>
  ({ index, style }: RowProps) => {
    const quote: Quote = quotes[index];

    return (
      <Draggable draggableId={quote.id} index={index} key={quote.id}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <QuoteItem
            provided={provided}
            quote={quote}
            isDragging={snapshot.isDragging}
            style={{ margin: 0, ...style }}
            index={index}
          />
        )}
      </Draggable>
    );
  };

function App(props: Props): ReactElement {
  const [quotes, setQuotes] = useState(() => props.initial);

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    if (result.source.index === result.destination.index) {
      return;
    }

    const newQuotes: Quote[] = reorder(
      quotes,
      result.source.index,
      result.destination.index,
    );
    setQuotes(newQuotes);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable"
        mode="virtual"
        renderClone={(
          provided: DraggableProvided,
          snapshot: DraggableStateSnapshot,
          rubric: DraggableRubric,
        ) => (
          <QuoteItem
            provided={provided}
            isDragging={snapshot.isDragging}
            quote={quotes[rubric.source.index]}
            style={{ margin: 0 }}
            index={rubric.source.index}
          />
        )}
      >
        {(droppableProvided: DroppableProvided) => (
          <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }: any) => (
              <List
                autoHeight
                rowCount={quotes.length}
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                rowHeight={110}
                width={300}
                ref={(ref: any) => {
                  // react-virtualized has no way to get the list's ref that I can so
                  // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                  if (ref) {
                    // eslint-disable-next-line react/no-find-dom-node
                    const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                    if (whatHasMyLifeComeTo instanceof HTMLElement) {
                      droppableProvided.innerRef(whatHasMyLifeComeTo);
                    }
                  }
                }}
                rowRenderer={getRowRender(quotes)}
              />
            )}
          </WindowScroller>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
