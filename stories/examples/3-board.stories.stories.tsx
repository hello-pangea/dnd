import React from 'react';
import Board from '../src/board/board';
import { authorQuoteMap, generateQuoteMap } from '../src/data';

const data = {
  medium: () => generateQuoteMap(100),
  large: () => generateQuoteMap(500),
};

export default {
  title: 'Examples/board',
};

export const Simple = {
  render: () => <Board initial={authorQuoteMap} />,
  name: 'simple',
};

export const DraggingAClone = {
  render: () => <Board initial={authorQuoteMap} useClone />,
  name: 'dragging a clone',
};

export const MediumDataSet = {
  render: () => <Board initial={data.medium()} />,
  name: 'medium data set',
};

export const LargeDataSet = {
  render: () => <Board initial={data.large()} />,
  name: 'large data set',
};

export const LongListsInAShortContainer = {
  render: () => <Board initial={data.medium()} containerHeight="60vh" />,

  name: 'long lists in a short container',
};

export const ScrollableColumns = {
  render: () => <Board initial={authorQuoteMap} withScrollableColumns />,

  name: 'scrollable columns',
};

export const WithCombining = {
  render: () => <Board initial={authorQuoteMap} isCombineEnabled />,

  name: 'with combining',
};

export const WithCombiningAndCloning = {
  render: () => <Board initial={authorQuoteMap} isCombineEnabled useClone />,

  name: 'with combining and cloning',
};
