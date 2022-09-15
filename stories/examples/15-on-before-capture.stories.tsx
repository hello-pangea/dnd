import React from 'react';
import { storiesOf } from '@storybook/react';
import AddingThings from '../src/on-before-capture/adding-things';

storiesOf('Examples/onBeforeCapture', module).add('adding things', () => (
  <AddingThings />
));
