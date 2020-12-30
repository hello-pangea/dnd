import React from 'react';
import { storiesOf } from '@storybook/react';
import QuoteApp from './src/function-component/quote-app';

storiesOf(
  'Function component usage',
  module,
).add('using rfd with function components and hooks', () => <QuoteApp />);
