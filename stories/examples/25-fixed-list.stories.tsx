import React from 'react';
import { storiesOf } from '@storybook/react';
import WithFixedSidebar from '../src/fixed-list/fixed-sidebar';
import FixedSidebar from '../src/fixed-list/fixed-scrollable-sidebar';

storiesOf('Examples/fixed list', module).add('with fixed sidebar', () => (
  <WithFixedSidebar />
));

storiesOf('Examples/fixed list', module).add('fixed scrollable sidebar', () => (
  <FixedSidebar />
));
