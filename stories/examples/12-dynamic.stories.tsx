import React from 'react';
import DynamicWithControls from '../src/dynamic/with-controls';
import DynamicLazyLoading from '../src/dynamic/lazy-loading';

export default {
  title: 'Examples/Dynamic changes during a drag (v11 only)',
};

export const WithControls = {
  render: () => <DynamicWithControls />,
  name: 'With controls',
};

export const LazyLoading = {
  render: () => <DynamicLazyLoading />,
  name: 'Lazy loading',
};
