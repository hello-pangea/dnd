import React from 'react';
import { storiesOf } from '@storybook/react';
import { getQuotes } from '../src/data';
import QuoteAppMUI from '../src/vertical/quote-app-mui';

const generateData = {
  small: () => getQuotes(),
  medium: () => getQuotes(40),
  large: () => getQuotes(500),
};

storiesOf('Examples/MUI', module)
  .add('cards', () => (
    <QuoteAppMUI initial={generateData.small()} variant="card" />
  ))
  .add('boxes', () => (
    <QuoteAppMUI initial={generateData.small()} variant="box" />
  ));
