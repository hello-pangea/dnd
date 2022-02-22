import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  ReactElement,
} from 'react';
import { getBox } from 'css-box-model';
import type { Position, BoxModel } from 'css-box-model';
import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import { getQuotes } from '../data';
import type { Quote } from '../types';
import { DragDropContext, Droppable, Draggable } from '../../../src';
import type { BeforeCapture, DropResult } from '../../../src';
import bindEvents from '../../../src/view/event-bindings/bind-events';
import { BeforeCaptureEvent } from '../../../src/view/event-bindings/event-types';
import { grid } from '../constants';
import reorder, { moveBetween } from '../reorder';

const UseTrimmingContext = React.createContext<boolean>(false);

const Parent = styled.div`
  display: flex;
`;

type Width = 'small' | 'large';

interface ItemProps {
  quote: Quote;
  index: number;
  shouldAllowTrimming: boolean;
}

const StyledItem = styled.div`
  border: 1px solid ${colors.N100};
  background: ${colors.G50};
  padding: ${grid}px;
  margin-bottom: ${grid}px;
  user-select: none;
`;

function Item(props: ItemProps) {
  const { quote, index } = props;
  const ref = useRef<HTMLElement | undefined | null>(null);
  const useTrimming: boolean = useContext(UseTrimmingContext);

  useEffect(() => {
    const unsubscribe = bindEvents(window, [
      {
        eventName: 'onBeforeCapture',
        fn: (event) => {
          if (!useTrimming) {
            return;
          }
          if (!props.shouldAllowTrimming) {
            return;
          }

          const before: BeforeCapture = event.detail.before;
          const clientSelection: Position = event.detail.clientSelection;

          if (before.mode !== 'FLUID') {
            return;
          }

          if (before.draggableId !== quote.id) {
            return;
          }

          const el: HTMLElement | undefined | null = ref.current;

          if (!el) {
            return;
          }

          const box: BoxModel = getBox(el);

          // want to shrink the item to 200px wide.
          // want it to be centered as much as possible to the cursor
          const targetWidth = 250;
          const halfWidth: number = targetWidth / 2;
          const distanceToLeft: number = Math.max(
            clientSelection.x - box.borderBox.left,
            0,
          );

          el.style.width = `${targetWidth}px`;

          // Nothing left to do
          if (distanceToLeft < halfWidth) {
            return;
          }

          // what the new left will be
          const proposedLeftOffset: number = distanceToLeft - halfWidth;
          // what the raw right value would be
          const targetRight: number =
            box.borderBox.left + proposedLeftOffset + targetWidth;

          // how much we would be going past the right value
          const rightOverlap: number = Math.max(
            targetRight - box.borderBox.right,
            0,
          );

          // need to ensure that we don't pull the element past
          // it's resting right position
          const leftOffset: number = proposedLeftOffset - rightOverlap;

          el.style.position = 'relative';
          el.style.left = `${leftOffset}px`;
        },
      } as BeforeCaptureEvent,
    ]);

    return unsubscribe;
  }, [props.shouldAllowTrimming, quote.id, useTrimming]);

  return (
    <Draggable draggableId={quote.id} index={index}>
      {(provided) => (
        <StyledItem
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={(node?: HTMLElement | null) => {
            provided.innerRef(node);
            ref.current = node;
          }}
        >
          {quote.content}
        </StyledItem>
      )}
    </Draggable>
  );
}

interface ListProps {
  listId: string;
  quotes: Quote[];
  width: Width;
}

interface StyledListProps {
  isDraggingOver: boolean;
  width: Width;
}

const StyledList = styled.div<StyledListProps>`
  border: 1px solid ${colors.N100};
  margin: ${grid}px;
  padding: ${grid}px;
  box-sizing: border-box;
  background-color: ${(props) =>
    props.isDraggingOver ? colors.B100 : 'inherit'};
  width: ${(props) => (props.width === 'large' ? 800 : 200)}px;
`;

function List(props: ListProps) {
  return (
    <Droppable droppableId={props.listId}>
      {(provided, snapshot) => (
        <StyledList
          {...provided.droppableProps}
          ref={provided.innerRef}
          isDraggingOver={snapshot.isDraggingOver}
          width={props.width}
        >
          {props.quotes.map((quote: Quote, index: number) => (
            <Item
              key={quote.id}
              quote={quote}
              index={index}
              shouldAllowTrimming={props.width === 'large'}
            />
          ))}
          {provided.placeholder}
        </StyledList>
      )}
    </Droppable>
  );
}

export default function App(): ReactElement {
  const [first, setFirst] = useState(() => getQuotes(3));
  const [second, setSecond] = useState(() => getQuotes(3));
  const [useTrimming, setUseTrimming] = useState(false);
  const clientSelectionRef = useRef<Position>({ x: 0, y: 0 });

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'first') {
        setFirst(reorder(first, source.index, destination.index));
      } else {
        setSecond(reorder(second, source.index, destination.index));
      }
      return;
    }

    const { list1, list2 } = moveBetween({
      list1: {
        id: 'first',
        values: first,
      },
      list2: {
        id: 'second',
        values: second,
      },
      source,
      destination,
    });

    setFirst(list1.values);
    setSecond(list2.values);
  }

  useEffect(() => {
    const unsubscribe = bindEvents(window, [
      {
        eventName: 'mousemove',
        fn: (event: MouseEvent) => {
          const current: Position = {
            x: event.clientX,
            y: event.clientY,
          };
          clientSelectionRef.current = current;
        },
        options: { passive: true },
      },
    ]);
    return unsubscribe;
  });

  function onBeforeCapture(before: BeforeCapture) {
    window.dispatchEvent(
      new CustomEvent('onBeforeCapture', {
        detail: { before, clientSelection: clientSelectionRef.current },
      }),
    );
  }
  return (
    <UseTrimmingContext.Provider value={useTrimming}>
      <DragDropContext onBeforeCapture={onBeforeCapture} onDragEnd={onDragEnd}>
        <Parent>
          <List listId="first" quotes={first} width="small" />
          <List listId="second" quotes={second} width="large" />
        </Parent>
        Item trimming experiment:{' '}
        <strong>{useTrimming ? 'enabled' : 'disabled'}</strong>
        <button
          type="button"
          onClick={() => setUseTrimming((value: boolean) => !value)}
        >
          {useTrimming ? 'disable' : 'enable'}
        </button>
      </DragDropContext>
    </UseTrimmingContext.Provider>
  );
}
