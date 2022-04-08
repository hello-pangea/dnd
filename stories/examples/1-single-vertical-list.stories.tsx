import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from '@emotion/styled';
import QuoteApp from '../src/vertical/quote-app';
import { getQuotes } from '../src/data';
import { grid } from '../src/constants';

const generateData = {
  small: () => getQuotes(),
  medium: () => getQuotes(40),
  large: () => getQuotes(500),
};

const ScrollContainer = styled.div`
  box-sizing: border-box;
  background: lightgrey;
  padding: ${grid * 2}px;
  overflow-y: scroll;
  width: 500px;
  height: 100vh;
  position: relative;
`;

const Title = styled.h4`
  text-align: center;
  margin-bottom: ${grid}px;
`;

storiesOf('Examples/single vertical list', module)
  .add('basic', () => <QuoteApp initial={generateData.small()} />)
  .add('large data set', () => <QuoteApp initial={generateData.large()} />, {
    chromatic: {
      // This is to make sure we do not reach
      // the 25,000,000px limit of the snapshot.
      viewports: [320],
    },
  })
  .add('Droppable is a scroll container', () => (
    <QuoteApp
      initial={generateData.medium()}
      listStyle={{
        overflowY: 'scroll',
        maxHeight: '80vh',
        position: 'relative',
      }}
    />
  ))
  .add('window scrolling and a Droppable scroll container', () => (
    <QuoteApp
      initial={generateData.medium()}
      listStyle={{
        overflowY: 'scroll',
        maxHeight: '120vh',
        position: 'relative',
      }}
    />
  ))
  .add('within a larger scroll container', () => (
    <ScrollContainer>
      <Title>List is within a larger scroll container</Title>
      <QuoteApp initial={generateData.medium()} />
    </ScrollContainer>
  ))
  .add('with combine enabled', () => (
    <QuoteApp initial={generateData.small()} isCombineEnabled />
  ));
