import React from 'react';
import { storiesOf } from '@storybook/react';
import TaskApp from '../src/accessible/task-app';

storiesOf('Examples/Accessibility', module).add('single list', () => (
  <TaskApp />
));
