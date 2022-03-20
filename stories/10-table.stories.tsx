import React from 'react';
import { storiesOf } from '@storybook/react';
import WithDimensionLocking from './src/table/with-dimension-locking';
import WithFixedColumns from './src/table/with-fixed-columns';
import WithPortal from './src/table/with-portal';
import WithClone from './src/table/with-clone';
import { getQuotes } from './src/data';

storiesOf('Tables', module)
  .add('with fixed width columns', () => (
    <WithFixedColumns initial={getQuotes()} />
  ))
  .add('with dimension locking', () => (
    <WithDimensionLocking initial={getQuotes()} />
  ))
  .add('with clone', () => <WithClone initial={getQuotes()} />)
  .add('with custom portal', () => <WithPortal initial={getQuotes()} />);
