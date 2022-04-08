import React from 'react';
import { storiesOf } from '@storybook/react';
import QuoteApp from '../src/multiple-vertical/quote-app';
import { getQuotes } from '../src/data';

const generateQuoteMap = () => ({
  alpha: getQuotes(7),
  beta: getQuotes(3),
  gamma: getQuotes(7),
  delta: getQuotes(2),
  epsilon: getQuotes(10),
  zeta: getQuotes(5),
  eta: getQuotes(5),
  theta: getQuotes(5),
  iota: getQuotes(20),
  kappa: getQuotes(5),
});

storiesOf('Examples/multiple vertical lists', module).add('stress test', () => (
  <QuoteApp initial={generateQuoteMap()} />
));
