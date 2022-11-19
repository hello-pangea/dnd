import React, { ReactElement, useState } from 'react';
import styled from '@emotion/styled';

import { DropResult } from '../../../src/types';
import DragDropContext from '../../../src/view/drag-drop-context';
import { PartialAutoScrollOptions } from '../../../src/state/auto-scroller/fluid-scroller/autoscroll-config-types';

import reorder from '../reorder';
import type { Quote } from '../types';
import AuthorList from '../primatives/author-list';
import Board from '../board/board';
import { getQuotes, generateQuoteMap, authors } from '../data';
import Title from '../primatives/title';
import AutoScrollOptionsSetter from './autoscroll-setter';
import { defaultAutoScrollOptions } from '../../../src/state/auto-scroller/fluid-scroller/config';

const NUM_QUOTES = 30;

const Root = styled.div``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: auto;
`;

const Para = styled.p`
  margin: 2px;
  padding-left: 10px;
`;

export default function CustomizeAutoScrollApp(): ReactElement {
  const [quotes, setQuotes] = useState(getQuotes(NUM_QUOTES));
  const [authorListAutoScrollOptions, changeALAutoScrollOptions] =
    useState<PartialAutoScrollOptions>(defaultAutoScrollOptions);
  const [boardAutoScrollOptions, changeBoardAutoScrollOptions] =
    useState<PartialAutoScrollOptions>(defaultAutoScrollOptions);

  const boardValues = generateQuoteMap(NUM_QUOTES);
  const extraBoardValues = generateQuoteMap(NUM_QUOTES);
  // create copies so that the window size is larger
  for (const author of authors) {
    boardValues[`Second-${author.name}`] = extraBoardValues[author.name];
  }

  function onDragStart() {
    // Add a little vibration if the browser supports it.
    // Add's a nice little physical feedback
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  }

  function onDragEnd(result: DropResult) {
    // combining item
    if (result.combine) {
      // super simple: just removing the dragging item
      const newQuotes: Quote[] = [...quotes];
      newQuotes.splice(result.source.index, 1);
      setQuotes(newQuotes);
      return;
    }

    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newQuotes = reorder(
      quotes,
      result.source.index,
      result.destination.index,
    );

    setQuotes(newQuotes);
  }

  return (
    <Root>
      <Title>
        Configure <code>autoScrollOptions</code> for a single{' '}
        <code>DragDropContext</code>
        (hit enter to submit text box inputs):
      </Title>
      <Para>
        <code>startFromPercentage</code>: percentage of window, from the edge,
        at which to start scrolling (default: 0.25). Must be between 0 and 1.{' '}
        <br />
        <code>maxScrollAtPercentage</code>: percentage of window, from the edge,
        at which maximum scroll speed is achieved (default: 0.05). Must be
        between 0 and 1. <br />
        <code>maxPixelScroll</code>: maximum speed of auto scroll, in pixels per
        second (default: 28). Can be any number, including negative, which lets
        you scroll backwards! <br />
        <code>ease</code>: The function used to ease scroll. (default: f(x) =
        x^2). Here, choose linear, quadratic or cubic, but while coding, this
        can be any function from [0, 1] to [0, 1]. <br />
        <code>disabled</code>: if true, then dragging around either columns or
        quotes in the columns will not auto-scroll the window or the droppables
        (default: false). <br />
        <code>durationDampening.stopDampeningAt</code>: Time in milliseconds
        after which to finish dampening the auto scroll (default: 1200). <br />
        <code>durationDampening.accelerateAt</code>: Time in milliseconds after
        which to start accelerating the reduction of dampening of the autoScroll
        (default: 360).
      </Para>
      <AutoScrollOptionsSetter
        autoScrollOptions={authorListAutoScrollOptions}
        changeAutoScrollOptions={changeALAutoScrollOptions}
      />
      <Container>
        <DragDropContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          autoScrollOptions={authorListAutoScrollOptions}
        >
          <AuthorList quotes={quotes} listId="author-list" />
        </DragDropContext>
      </Container>
      <Title>
        Configure <code>autoScrollOptions</code> for a nested{' '}
        <code>DragDropContext</code>
      </Title>
      <AutoScrollOptionsSetter
        autoScrollOptions={boardAutoScrollOptions}
        changeAutoScrollOptions={changeBoardAutoScrollOptions}
      />
      <Container>
        <Board
          initial={boardValues}
          applyGlobalStyles={false}
          autoScrollOptions={boardAutoScrollOptions}
        />
      </Container>
    </Root>
  );
}
