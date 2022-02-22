import React, { CSSProperties, ReactElement, useState } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';
import type { Quote } from '../../types';
import { Droppable, Draggable, DragDropContext } from '../../../../src';

import type {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableRubric,
  DropResult,
} from '../../../../src';

import QuoteItem from '../../primatives/quote-item';
import reorder from '../../reorder';

interface Props {
  initial: Quote[];
}

interface RowProps {
  data: Quote[];
  index: number;
  style: CSSProperties;
}

const Row = React.memo(({ data: quotes, index, style }: RowProps) => {
  const quote: Quote = quotes[index];

  return (
    <Draggable draggableId={quote.id} index={index} key={quote.id}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <QuoteItem
          provided={provided}
          quote={quote}
          isDragging={snapshot.isDragging}
          isGroupedOver={Boolean(snapshot.combineTargetFor)}
          style={{ margin: 0, ...style }}
          index={index}
        />
      )}
    </Draggable>
  );
}, areEqual);

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
          <List
            height={500}
            itemCount={quotes.length}
            itemSize={100}
            width={300}
            // you will want to use List.outerRef rather than List.innerRef as it has the correct height when the list is unpopulated
            outerRef={droppableProvided.innerRef}
            itemData={quotes}
          >
            {Row}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
