import '@atlaskit/css-reset';

import React from 'react';
import { withPerformance } from 'storybook-addon-performance';
import { resetData } from '../stories/src/data';
import GlobalStyles from './custom-decorators/global-styles';
import welcomeMessage from './welcome-message';

welcomeMessage();

export const decorators = [
  (Story: React.ElementType, { id }: { id: string }) => {
    resetData(id);

    return <Story key={id} />;
  },
  (Story: React.ElementType): React.ReactElement => (
    <GlobalStyles>
      <Story />
    </GlobalStyles>
  ),
  withPerformance,
];

export const parameters = {
  layout: 'fullscreen',

  options: {
    storySort: {
      order: ['Welcome', 'Examples'],
    },
  },
};
