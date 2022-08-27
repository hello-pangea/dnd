import { storiesOf } from '@storybook/react';
import React from 'react';
import { getQuotes } from '../src/data';
import ReactVirtualizedBoard from '../src/virtual/react-virtualized/board';
import ReactVirtualizedList from '../src/virtual/react-virtualized/list';
import ReactVirtualizedWindowList from '../src/virtual/react-virtualized/window-list';
import ReactVirtuosoBoard from '../src/virtual/react-virtuoso/board';
import ReactVirtuosoList from '../src/virtual/react-virtuoso/list';
import ReactWindowBoard from '../src/virtual/react-window/board';
import ReactWindowList from '../src/virtual/react-window/list';

storiesOf('Examples/Virtual: react-virtuoso', module)
  .add('list', () => <ReactVirtuosoList initial={getQuotes(1000)} />)
  .add('board', () => <ReactVirtuosoBoard />);

storiesOf('Examples/Virtual: react-window', module)
  .add('list', () => <ReactWindowList initial={getQuotes(1000)} />)
  .add('board', () => <ReactWindowBoard />);

storiesOf('Examples/Virtual: react-virtualized', module)
  .add('list', () => <ReactVirtualizedList initial={getQuotes(1000)} />)
  .add('board', () => <ReactVirtualizedBoard />)
  .add(
    'window list',
    () => <ReactVirtualizedWindowList initial={getQuotes(700)} />,
    {
      chromatic: {
        // This is to make sure we do not reach
        // the 25,000,000px limit of the snapshot.
        viewports: [320],
      },
    },
  );
