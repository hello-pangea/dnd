import React from 'react';
import Simple from '../src/simple/simple';
import WithSimpleScroll from '../src/simple/simple-scrollable';
import WithSimpleMixedSpacing from '../src/simple/simple-mixed-spacing';

export default {
  title: 'Examples/Super simple',
};

export const VerticalList = {
  render: () => <Simple />,
  name: 'vertical list',
};

export const VerticalListWithScrollOverflowAuto = {
  render: () => <WithSimpleScroll overflow="auto" />,

  name: 'vertical list with scroll (overflow: auto)',
};

export const VerticalListWithScrollOverflowScroll = {
  render: () => <WithSimpleScroll overflow="scroll" />,

  name: 'vertical list with scroll (overflow: scroll)',
};

export const WithMixedSpacing = {
  render: () => <WithSimpleMixedSpacing />,
  name: 'with mixed spacing',
};
