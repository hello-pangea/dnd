import '@atlaskit/css-reset';

import { Preview } from '@storybook/react';
import React from 'react';
import { resetData } from '../stories/src/data';
import GlobalStyles from './custom-decorators/global-styles';
import welcomeMessage from './welcome-message';

welcomeMessage();

const preview: Preview = {
  decorators: [
    (Story, { id }) => {
      resetData(id);

      return <Story key={id} />;
    },
    (Story) => (
      <GlobalStyles>
        <Story />
      </GlobalStyles>
    ),
  ],
  parameters: {
    layout: 'fullscreen',

    options: {
      storySort: {
        order: ['Welcome', 'Examples'],
      },
    },
  },
};

export default preview;
