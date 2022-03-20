import React from 'react';
import { storiesOf } from '@storybook/react';
import MultipleContexts from './src/programmatic/multiple-contexts';

storiesOf('Multiple contexts', module).add(
  'with multiple contexts',
  () => <MultipleContexts />,
  {
    // disables Chromatic's snapshotting, because
    // the snapshot will always be different due to
    // the programmatic dragging
    chromatic: { disableSnapshot: true },
  },
);
