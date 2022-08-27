import { colors } from '@atlaskit/theme';
import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import React, { ReactElement, useEffect, useReducer, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { borderRadius, grid } from '../../constants';
import { generateQuoteMap } from '../../data';
import QuoteItem from '../../primatives/quote-item';
import { getBackgroundColor } from '../../primatives/quote-list';
import Title from '../../primatives/title';
import { reorderQuoteMap } from '../../reorder';
import type { Quote, QuoteMap } from '../../types';
import QuoteCountSlider from '../quote-count-chooser';

const Container = styled.div`
  display: flex;
`;

interface RowProps {
  quote: Quote;
  provided: DraggableProvided;
  isDragging: boolean;
}

// Memoizing row items for even better performance!
const Row = React.memo(({ quote, provided, isDragging }: RowProps) => {
  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={provided.draggableProps.style}
      className={`item ${isDragging ? 'is-dragging' : ''}`}
    >
      <div style={{ padding: '4px 8px 4px 8px' }}>
        <QuoteItem
          quote={quote}
          isDragging={isDragging}
          style={{ margin: '0px' }}
        />
      </div>
    </div>
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

interface ColumnProps {
  columnId: string;
  quotes: Quote[];
}

const ColumnContainer = styled.div`
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${colors.N30};
  flex-shrink: 0;
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`;

const Column = React.memo(function Column(props: ColumnProps) {
  const { columnId, quotes } = props;

  return (
    <ColumnContainer>
      <Title>{columnId}</Title>
      <Droppable
        droppableId={columnId}
        mode="virtual"
        renderClone={(
          provided: DraggableProvided,
          snapshot: DraggableStateSnapshot,
          rubric: DraggableRubric,
        ) => (
          <Row
            provided={provided}
            isDragging={snapshot.isDragging}
            quote={quotes[rubric.source.index]}
          />
        )}
      >
        {(droppableProvided, snapshot) => {
          // Add an extra item to our list to make space for a dragging item
          // Usually the DroppableProvided.placeholder does this, but that won't
          // work in a virtual list
          const itemCount: number = snapshot.isUsingPlaceholder
            ? quotes.length + 1
            : quotes.length;

          return (
            <Virtuoso
              components={{
                Item: HeightPreservingItem,
              }}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              scrollerRef={droppableProvided.innerRef}
              data={quotes}
              totalCount={itemCount}
              style={{
                width: 300,
                height: 500,
                backgroundColor: getBackgroundColor(
                  snapshot.isDraggingOver,
                  Boolean(snapshot.draggingFromThisWith),
                ),
                transition: 'background-color 0.2s ease',
              }}
              // eslint-disable-next-line react/no-unstable-nested-components
              itemContent={(index, quote) => {
                // We are rendering an extra item for the placeholder
                // Do do this we increased our data set size to include one 'fake' item
                if (!quote) {
                  return null;
                }

                return (
                  <Draggable
                    draggableId={quote.id}
                    index={index}
                    key={quote.id}
                  >
                    {(provided) => (
                      <Row
                        quote={quote}
                        provided={provided}
                        isDragging={false}
                      />
                    )}
                  </Draggable>
                );
              }}
            />
          );
        }}
      </Droppable>
    </ColumnContainer>
  );
});

interface State {
  itemCount: number;
  quoteMap: QuoteMap;
  columnKeys: string[];
}

function getColumnKeys(quoteMap: QuoteMap): string[] {
  return Object.keys(quoteMap).sort();
}

function getInitialState() {
  const itemCount = 10000;
  const quoteMap: QuoteMap = generateQuoteMap(itemCount);
  const columnKeys: string[] = getColumnKeys(quoteMap);
  return {
    itemCount,
    quoteMap,
    columnKeys,
  };
}

type Action =
  | {
      type: 'CHANGE_COUNT';
      payload: number;
    }
  | {
      type: 'REORDER';
      payload: QuoteMap;
    };

function reducer(state: State, action: Action) {
  if (action.type === 'CHANGE_COUNT') {
    const quoteMap: QuoteMap = generateQuoteMap(action.payload);
    return {
      itemCount: action.payload,
      quoteMap,
      columnKeys: getColumnKeys(quoteMap),
    };
  }
  if (action.type === 'REORDER') {
    return {
      itemCount: state.itemCount,
      quoteMap: action.payload,
      columnKeys: getColumnKeys(action.payload),
    };
  }

  return state;
}

function Board(): ReactElement {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const updated = reorderQuoteMap({
      quoteMap: state.quoteMap,
      source,
      destination,
    });

    dispatch({ type: 'REORDER', payload: updated.quoteMap });
  }

  return (
    <>
      <style>
        {`
          .height-preserving-container:empty {
            min-height: calc(var(--child-height));
            box-sizing: border-box;
          }
      `}
      </style>
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          {state.columnKeys.map((key: string) => {
            const quotes: Quote[] = state.quoteMap[key];

            return <Column key={key} quotes={quotes} columnId={key} />;
          })}
        </Container>
        <QuoteCountSlider
          library="react-virtuoso"
          count={state.itemCount}
          onCountChange={(count: number) =>
            dispatch({ type: 'CHANGE_COUNT', payload: count })
          }
        />
      </DragDropContext>
      <Global
        styles={css`
          body {
            background: ${colors.B200} !important;
          }
        `}
      />
    </>
  );
}

export default Board;
