import React, { Component, ReactElement } from 'react';
import type { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import { DragDropContext, Droppable, Draggable } from '../../../src';
import { invariant } from '../../../src/invariant';
import reorder from '../reorder';
import { grid } from '../constants';
import type { Quote } from '../types';
import type {
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from '../../../src';

interface ItemProps {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  quote: Quote;
}

const portal: HTMLElement = document.createElement('div');
portal.classList.add('my-super-cool-portal');

invariant(document.body, 'body not ready for portal creation!');

document.body.appendChild(portal);

interface SimpleQuoteProps {
  inPortal: boolean;
}

const SimpleQuote = styled.div<SimpleQuoteProps>`
  padding: ${grid}px;
  margin-bottom: ${grid}px;
  background-color: ${colors.B50};
  border: 1px solid ${colors.B200};

  /* used for positioning the after content */
  position: relative;

  /* stylelint-disable  comment-empty-line-before */
  /* add little portal indicator when in a portal */
  ${(props) =>
    props.inPortal
      ? `
    ::after {
      position: absolute;
      background: lightgreen;
      padding: ${grid}px;
      bottom: 0;
      right: 0;
      content: "in portal";
    }
  `
      : ''}/* stylelint-enable */;
`;

class PortalAwareItem extends Component<ItemProps> {
  render() {
    const provided: DraggableProvided = this.props.provided;
    const snapshot: DraggableStateSnapshot = this.props.snapshot;
    const quote: Quote = this.props.quote;

    const usePortal: boolean = snapshot.isDragging;

    const child: ReactNode = (
      <SimpleQuote
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        inPortal={usePortal}
      >
        {quote.content} <small>- {quote.author.name}</small>
      </SimpleQuote>
    );

    if (!usePortal) {
      return child;
    }

    // if dragging - put the item in a portal
    return ReactDOM.createPortal(child, portal);
  }
}

interface AppProps {
  initial: Quote[];
}

interface AppState {
  quotes: Quote[];
}

const Container = styled.div`
  margin: 0 auto;
  width: 300px;
`;

export default class PortalApp extends Component<AppProps, AppState> {
  state: AppState = {
    quotes: this.props.initial,
  };

  onDragEnd = (result: DropResult): void => {
    // dropped outside the list
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    // no movement
    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      this.state.quotes,
      result.source.index,
      result.destination.index,
    );

    this.setState({
      quotes,
    });
  };

  render(): ReactElement {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided: DroppableProvided) => (
            <Container
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {this.state.quotes.map((quote: Quote, index: number) => (
                <Draggable draggableId={quote.id} index={index} key={quote.id}>
                  {(
                    draggableProvided: DraggableProvided,
                    draggableSnapshot: DraggableStateSnapshot,
                  ) => (
                    <PortalAwareItem
                      quote={quote}
                      provided={draggableProvided}
                      snapshot={draggableSnapshot}
                    />
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
