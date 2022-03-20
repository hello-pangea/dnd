import React from 'react';
import { storiesOf } from '@storybook/react';
import WithControls from './src/programmatic/with-controls';
import Runsheet from './src/programmatic/runsheet';
import { getQuotes } from './src/data';

storiesOf('Programmatic dragging', module)
  .add('with controls', () => (
    <WithControls initial={getQuotes().slice(0, 3)} />
  ))
  .add('with runsheet', () => <Runsheet initial={getQuotes()} />, {
    // disables Chromatic's snapshotting, because
    // the snapshot will always be different due to
    // the programmatic dragging
    chromatic: { disableSnapshot: true },
  });
