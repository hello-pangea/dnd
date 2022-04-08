import React from 'react';
import { storiesOf } from '@storybook/react';
import QuoteApp from '../src/multiple-horizontal/quote-app';
import { getQuotes } from '../src/data';

const generateQuoteMap = () => ({
  alpha: getQuotes(20),
  beta: getQuotes(18),
  gamma: getQuotes(22),
});

storiesOf('Examples/multiple horizontal lists', module).add('stress test', () => (
  <QuoteApp initial={generateQuoteMap()} />
));
