import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { DragDropContext } from '../../../../src';
import { getPreset } from '../../../util/dimension';
import Draggable from '../../../../src/view/draggable/connected-draggable';
import type { DraggableProvided } from '../../../../src/view/draggable/draggable-types';
import DroppableContext from '../../../../src/view/context/droppable-context';

import type { DroppableContextValue } from '../../../../src/view/context/droppable-context';

const preset = getPreset();

const droppableContext: DroppableContextValue = {
  type: preset.home.descriptor.type,
  droppableId: preset.home.descriptor.id,
  isUsingCloneFor: null,
};

class Person extends Component<{
  name: string;
  provided: DraggableProvided;
}> {
  render() {
    const { provided, name } = this.props;
    return (
      <div
        ref={(ref) => provided.innerRef(ref)}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {name}
      </div>
    );
  }
}

interface Props {
  currentUser: string;
  children: (currentUser: string, dragProvided: DraggableProvided) => ReactNode;
}

function App({ currentUser, children }: Props) {
  return (
    <DragDropContext onDragEnd={() => {}}>
      <DroppableContext.Provider value={droppableContext}>
        <Draggable draggableId="drag-1" index={0}>
          {(dragProvided) => children(currentUser, dragProvided)}
        </Draggable>
      </DroppableContext.Provider>
    </DragDropContext>
  );
}

function getMock() {
  return jest.fn((currentUser: string, provided: DraggableProvided) => (
    <Person name={currentUser} provided={provided} />
  ));
}

it('should render the child function when the parent renders', () => {
  const child = getMock();
  const { container } = render(<App currentUser="Jake">{child}</App>);

  expect(child).toHaveBeenCalledTimes(1);
  expect(container.textContent).toBe('Jake');
});

it('should render the child function when the parent re-renders', () => {
  const child = getMock();
  const { container, rerender } = render(<App currentUser="Jake">{child}</App>);
  expect(child).toHaveBeenCalledTimes(1);

  rerender(<App currentUser="Jake">{child}</App>);
  expect(child).toHaveBeenCalledTimes(2);

  expect(container.textContent).toBe('Jake');
});

it('should render the child function when the parents props changes that cause a re-render', () => {
  const child = getMock();
  const { container, rerender } = render(<App currentUser="Jake">{child}</App>);
  expect(child).toHaveBeenCalledTimes(1);

  rerender(<App currentUser="Finn">{child}</App>);
  expect(child).toHaveBeenCalledTimes(2);

  expect(container.textContent).toBe('Finn');
});
