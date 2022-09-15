import React, { Component, ReactElement } from 'react';
import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { Quote } from '../types';
import AuthorList from '../primatives/author-list';
import reorder from '../reorder';
import { grid } from '../constants';

interface Props {
  initial: Quote[];
  internalScroll?: boolean;
  isCombineEnabled?: boolean;
}

interface State {
  quotes: Quote[];
}

const Root = styled.div`
  padding: ${grid}px;
  background: ${colors.B50};
`;

export default class AuthorApp extends Component<Props, State> {
  /* eslint-disable react/sort-comp */
  static defaultProps = {
    isCombineEnabled: false,
  };

  state: State = {
    quotes: this.props.initial,
  };
  /* eslint-enable react/sort-comp */

  onDragEnd = (result: DropResult): void => {
    // super simple, just removing the dragging item
    if (result.combine) {
      const quotes: Quote[] = [...this.state.quotes];
      quotes.splice(result.source.index, 1);
      this.setState({ quotes });
      return;
    }

    // dropped outside the list
    if (!result.destination) {
      return;
    }

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
        <Root>
          <AuthorList
            listId="AUTHOR"
            internalScroll={this.props.internalScroll}
            isCombineEnabled={this.props.isCombineEnabled}
            quotes={this.state.quotes}
          />
        </Root>
      </DragDropContext>
    );
  }
}
