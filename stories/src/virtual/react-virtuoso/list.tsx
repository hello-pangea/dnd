import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import React, { ReactElement, useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import type {
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
  DropResult,
} from '@hello-pangea/dnd';
import type { Quote } from '../../types';

import QuoteItem from '../../primatives/quote-item';
import reorder from '../../reorder';

interface Props {
  initial: Quote[];
}

interface RowProps {
  quote: Quote;
  index: number;
  provided: DraggableProvided;
  isDragging: boolean;
}

const Row = React.memo(({ quote, index, provided, isDragging }: RowProps) => {
  return (
    <QuoteItem
      provided={provided}
      quote={quote}
      isDragging={isDragging}
      style={{ margin: 0 }}
      index={index}
      className={`item ${isDragging ? 'is-dragging' : ''}`}
    />
  );
});

const HeightPreservingItem = ({ children, ...props }: any) => {
  const [size, setSize] = useState(0);
  const knownSize = props['data-known-size'];
  useEffect(() => {
    setSize((prevSize) => {
      return knownSize === 0 ? prevSize : knownSize;
    });
  }, [knownSize]);
  return (
    <div
      {...props}
      className="height-preserving-container"
      // check styling in the style tag below
      style={{ '--child-height': `${size}px` }}
    >
      {children}
    </div>
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
      <style>
        {`
          .height-preserving-container:empty {
            min-height: calc(var(--child-height));
            box-sizing: border-box;
          }
      `}
      </style>
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
        {(droppableProvided) => (
          <Virtuoso
            components={{
              Item: HeightPreservingItem,
            }}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            scrollerRef={droppableProvided.innerRef}
            data={quotes}
            style={{ width: 300, height: 500 }}
            // eslint-disable-next-line react/no-unstable-nested-components
            itemContent={(index, quote) => (
              <Draggable draggableId={quote.id} index={index} key={quote.id}>
                {(provided) => (
                  <Row
                    quote={quote}
                    index={index}
                    provided={provided}
                    isDragging={false}
                  />
                )}
              </Draggable>
            )}
          />
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
