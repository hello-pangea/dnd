import React from 'react';
import { storiesOf } from '@storybook/react';
import InteractiveElementsApp from '../src/interactive-elements/interactive-elements-app';

storiesOf('Examples/nested interative elements', module).add('stress test', () => (
  <InteractiveElementsApp />
));
