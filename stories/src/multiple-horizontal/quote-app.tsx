import React, { Component, ReactElement } from 'react';
import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import { DragDropContext } from '@react-forked/dnd';
import type { DropResult } from '@react-forked/dnd';
import AuthorList from '../primatives/author-list';
import { grid } from '../constants';
import { reorderQuoteMap } from '../reorder';
import type { ReorderQuoteMapResult } from '../reorder';
import type { QuoteMap } from '../types';

const Root = styled.div`
  background-color: ${colors.B200};
  box-sizing: border-box;
  padding: ${grid * 2}px;
  min-height: 100vh;

  /* flexbox */
  display: flex;
  flex-direction: column;
`;

interface Props {
  initial: QuoteMap;
}

type State = ReorderQuoteMapResult;

export default class QuoteApp extends Component<Props, State> {
  /* eslint-disable react/sort-comp */

  state: State = {
    quoteMap: this.props.initial,
  };

  onDragEnd = (result: DropResult): void => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    this.setState(
      reorderQuoteMap({
        quoteMap: this.state.quoteMap,
        source: result.source,
        destination: result.destination,
      }),
    );
  };

  render(): ReactElement {
    const { quoteMap } = this.state;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Root>
          {Object.keys(quoteMap).map((key: string) => (
            <AuthorList
              internalScroll
              key={key}
              listId={key}
              listType="CARD"
              quotes={quoteMap[key]}
            />
          ))}
        </Root>
      </DragDropContext>
    );
  }
}
