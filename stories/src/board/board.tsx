import React, { Component, ReactElement } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { colors } from '@atlaskit/theme';
import type {
  DropResult,
  DraggableLocation,
  DroppableProvided,
} from '@hello-pangea/dnd';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type { QuoteMap, Quote } from '../types';
import Column from './column';
import reorder, { reorderQuoteMap } from '../reorder';
import { PartialAutoScrollerOptions } from '../../../src/state/auto-scroller/fluid-scroller/auto-scroller-options-types';

interface ParentContainerProps {
  height: string;
}

const ParentContainer = styled.div<ParentContainerProps>`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

const Container = styled.div`
  background-color: ${colors.B100};
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

interface Props {
  initial: QuoteMap;
  withScrollableColumns?: boolean;
  isCombineEnabled?: boolean;
  isCombineOnly?: boolean;
  containerHeight?: string;
  useClone?: boolean;
  applyGlobalStyles?: boolean;
  autoScrollerOptions?: PartialAutoScrollerOptions;
}

interface State {
  columns: QuoteMap;
  ordered: string[];
}

export default class Board extends Component<Props, State> {
  /* eslint-disable react/sort-comp */
  static defaultProps = {
    isCombineEnabled: false,
    isCombineOnly: false,
    applyGlobalStyles: true,
  };

  state: State = {
    columns: this.props.initial,
    ordered: Object.keys(this.props.initial),
  };

  onDragEnd = (result: DropResult): void => {
    if (result.combine) {
      if (result.type === 'COLUMN') {
        const shallow: string[] = [...this.state.ordered];
        shallow.splice(result.source.index, 1);
        this.setState({ ordered: shallow });
        return;
      }

      const column: Quote[] = this.state.columns[result.source.droppableId];
      const withQuoteRemoved: Quote[] = [...column];
      withQuoteRemoved.splice(result.source.index, 1);
      const columns: QuoteMap = {
        ...this.state.columns,
        [result.source.droppableId]: withQuoteRemoved,
      };
      this.setState({ columns });
      return;
    }

    // dropped nowhere
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

    // reordering column
    if (result.type === 'COLUMN') {
      const ordered: string[] = reorder(
        this.state.ordered,
        source.index,
        destination.index,
      );

      this.setState({
        ordered,
      });

      return;
    }

    const data = reorderQuoteMap({
      quoteMap: this.state.columns,
      source,
      destination,
    });

    this.setState({
      columns: data.quoteMap,
    });
  };

  render(): ReactElement {
    const columns: QuoteMap = this.state.columns;
    const ordered: string[] = this.state.ordered;
    const {
      containerHeight,
      useClone,
      isCombineEnabled,
      isCombineOnly,
      withScrollableColumns,
      applyGlobalStyles,
    } = this.props;

    const board = (
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(containerHeight)}
        isCombineEnabled={isCombineEnabled}
        isCombineOnly={isCombineOnly}
      >
        {(provided: DroppableProvided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {ordered.map((key: string, index: number) => (
              <Column
                key={key}
                index={index}
                title={key}
                quotes={columns[key]}
                isScrollable={withScrollableColumns}
                isCombineEnabled={isCombineEnabled}
                isCombineOnly={isCombineOnly}
                useClone={useClone}
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    );

    return (
      <React.Fragment>
        <DragDropContext
          onDragEnd={this.onDragEnd}
          autoScrollerOptions={this.props.autoScrollerOptions}
        >
          {containerHeight ? (
            <ParentContainer height={containerHeight}>{board}</ParentContainer>
          ) : (
            board
          )}
        </DragDropContext>
        {applyGlobalStyles ? (
          <Global
            styles={css`
              body {
                background: ${colors.B200};
              }
            `}
          />
        ) : null}
      </React.Fragment>
    );
  }
}
