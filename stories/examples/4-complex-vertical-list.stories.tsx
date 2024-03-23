import React from 'react';
import NestedQuoteApp from '../src/vertical-nested/quote-app';
import GroupedQuoteApp from '../src/vertical-grouped/quote-app';
import { authorQuoteMap } from '../src/data';

export default {
  title: 'Examples/complex vertical list',
};

export const Grouped = {
  render: () => <GroupedQuoteApp initial={authorQuoteMap} />,
  name: 'grouped',
};

export const NestedVerticalLists = {
  render: () => <NestedQuoteApp />,
  name: 'nested vertical lists',
};
