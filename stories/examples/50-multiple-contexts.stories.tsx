import React from 'react';
import MultipleContexts from '../src/programmatic/multiple-contexts';

export default {
  title: 'Examples/Multiple contexts',
};

export const WithMultipleContexts = {
  render: () => <MultipleContexts />,
  name: 'with multiple contexts',

  parameters: {
    // disables Chromatic's snapshotting, because
    // the snapshot will always be different due to
    // the programmatic dragging
    chromatic: { disableSnapshot: true },
  },
};
