import React from 'react';
import ProgrammaticWithControls from '../src/programmatic/with-controls';
import ProgrammaticRunsheet from '../src/programmatic/runsheet';
import { getQuotes } from '../src/data';

export default {
  title: 'Examples/Programmatic dragging',
};

export const WithControls = {
  render: () => <ProgrammaticWithControls initial={getQuotes().slice(0, 3)} />,

  name: 'with controls',
};

export const WithRunsheet = {
  render: () => <ProgrammaticRunsheet initial={getQuotes()} />,
  name: 'with runsheet',

  parameters: {
    // disables Chromatic's snapshotting, because
    // the snapshot will always be different due to
    // the programmatic dragging
    chromatic: { disableSnapshot: true },
  },
};
