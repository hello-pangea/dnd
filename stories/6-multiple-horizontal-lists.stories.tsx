import React from 'react';
import { storiesOf } from '@storybook/react';
import QuoteApp from './src/multiple-horizontal/quote-app';
import { getQuotes } from './src/data';

const quoteMap = {
  alpha: getQuotes(20),
  beta: getQuotes(18),
  gamma: getQuotes(22),
};

storiesOf('multiple horizontal lists', module).add('stress test', () => (
  <QuoteApp initial={quoteMap} />
));
