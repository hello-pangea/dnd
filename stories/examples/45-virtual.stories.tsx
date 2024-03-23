import React from 'react';
import ReactWindowList from '../src/virtual/react-window/list';
import { getQuotes } from '../src/data';
import ReactWindowBoard from '../src/virtual/react-window/board';

export default {
  title: 'Examples/Virtual: react-window',
};

export const List = {
  render: () => <ReactWindowList initial={getQuotes(1000)} />,
  name: 'list',
};

export const Board = {
  render: () => <ReactWindowBoard />,
  name: 'board',
};
