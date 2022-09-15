import '@atlaskit/css-reset';

import { DecoratorFn } from '@storybook/react';
import React from 'react';
import { resetData } from '../stories/src/data';
import GlobalStyles from './custom-decorators/global-styles';
import welcomeMessage from './welcome-message';

welcomeMessage();

export const decorators: DecoratorFn[] = [
  (story, { id }: { id: string }) => {
    resetData(id);

    return story({ key: id });
  },
  (story) => <GlobalStyles>{story()}</GlobalStyles>,
];

export const parameters = {
  layout: 'fullscreen',

  options: {
    storySort: {
      order: ['Welcome', 'Examples'],
    },
  },
};
