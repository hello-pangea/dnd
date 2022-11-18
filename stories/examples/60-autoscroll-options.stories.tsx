import React from 'react';
import { storiesOf } from '@storybook/react';
import CustomizeAutoScrollApp from '../src/customize-autoscroll/customize-autoscroll-app';

storiesOf('Examples/Custom Auto-Scroll Options', module).add(
  'Customize properties of autoScroll within multiple DragDropContexts',
  () => <CustomizeAutoScrollApp />,
);
