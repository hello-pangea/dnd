import React from 'react';
// import { Draggable, Droppable, DragDropContext } from '../../src/';

class App extends React.Component {
  render() {
    return 'Used for debugging codesandbox examples (copy paste them into this file)';
  }
}

export default {
  title: 'Examples/Troubleshoot example',
};

export const DebugExample = {
  render: () => <App />,
  name: 'debug example',
};
