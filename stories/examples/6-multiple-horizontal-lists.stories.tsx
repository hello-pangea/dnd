import React from 'react';
import QuoteApp from '../src/multiple-horizontal/quote-app';
import { getQuotes } from '../src/data';

const generateQuoteMap = () => ({
  alpha: getQuotes(20),
  beta: getQuotes(18),
  gamma: getQuotes(22),
});

export default {
  title: 'Examples/multiple horizontal lists',
};

export const StressTest = {
  render: () => <QuoteApp initial={generateQuoteMap()} />,
  name: 'stress test',
};
