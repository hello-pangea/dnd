import React from 'react';
import FunnyDrop from '../src/custom-drop/funny-drop';
import NoDrop from '../src/custom-drop/no-drop';

export default {
  title: 'Examples/Custom drop animation',
};

export const FunnyDropAnimation = {
  render: () => <FunnyDrop />,
  name: 'funny drop animation',
};

export const NoDropAnimation = {
  render: () => <NoDrop />,
  name: 'no drop animation',
};
