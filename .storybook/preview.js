import '@atlaskit/css-reset';

import React from 'react';
import { withPerformance } from 'storybook-addon-performance';
import GlobalStyles from './custom-decorators/global-styles';
import welcomeMessage from "./welcome-message";

welcomeMessage();

export const decorators = [
  (Story) => <GlobalStyles><Story/></GlobalStyles>,
  withPerformance,
];

export const parameters = {
  layout: 'fullscreen',
};
