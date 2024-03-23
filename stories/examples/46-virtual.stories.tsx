import React from 'react';
import ReactVirtualizedList from '../src/virtual/react-virtualized/list';
import { getQuotes } from '../src/data';
import ReactVirtualizedBoard from '../src/virtual/react-virtualized/board';
import ReactVirtualizedWindowList from '../src/virtual/react-virtualized/window-list';

export default {
  title:
    'Examples/Virtual: react-virtualized (this library does not official support for react 18)',
};

export const List = {
  render: () => <ReactVirtualizedList initial={getQuotes(1000)} />,
  name: 'list',
};

export const Board = {
  render: () => <ReactVirtualizedBoard />,
  name: 'board',
};

export const WindowList = {
  render: () => <ReactVirtualizedWindowList initial={getQuotes(700)} />,
  name: 'window list',

  parameters: {
    chromatic: {
      // This is to make sure we do not reach
      // the 25,000,000px limit of the snapshot.
      viewports: [320],
    },
  },
};
