import React from 'react';
import MixedSizedItems from '../src/mixed-sizes/mixed-size-items';
import MixedSizedLists from '../src/mixed-sizes/mixed-size-lists';
import Experiment from '../src/mixed-sizes/mixed-size-lists-experiment';

export default {
  title: 'Examples/mixed sizes',
};

export const WithLargeDraggableSizeVariance = {
  render: () => <MixedSizedItems />,
  name: 'with large draggable size variance',
};

export const WithLargeDroppableSizeVariance = {
  render: () => <MixedSizedLists />,
  name: 'with large droppable size variance',
};

export const WithLargeDroppableSizeVarianceExperiment = {
  render: () => <Experiment />,
  name: 'with large droppable size variance (experiment)',
};
