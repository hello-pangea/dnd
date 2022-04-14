import { render, screen } from '@testing-library/react';
import React, { Component } from 'react';
import type { DroppableProvided } from '../../../../src/view/droppable/droppable-types';
import Droppable from '../../../../src/view/droppable/connected-droppable';
import { DragDropContext } from '../../../../src';

class Person extends Component<{
  name: string;
  provided: DroppableProvided;
}> {
  render() {
    const { provided, name } = this.props;
    return (
      <div ref={(ref) => provided.innerRef(ref)} {...provided.droppableProps}>
        hello {name}
      </div>
    );
  }
}

class App extends Component<{
  currentUser: string;
}> {
  render() {
    return (
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="drop-1">
          {(provided: DroppableProvided) => (
            <Person name={this.props.currentUser} provided={provided} />
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

let personRenderSpy: jest.SpyInstance;

beforeEach(() => {
  personRenderSpy = jest.spyOn(Person.prototype, 'render');
});

afterEach(() => {
  personRenderSpy.mockRestore();
});

it('should render the child function when the parent renders', () => {
  const { unmount } = render(<App currentUser="Jake" />);

  expect(personRenderSpy).toHaveBeenCalledTimes(1);
  expect(screen.getByText(/Jake/)).toHaveTextContent('hello Jake');

  unmount();
});

it('should render the child function when the parent re-renders', () => {
  const { rerender, unmount } = render(<App currentUser="Jake" />);

  rerender(<App currentUser="Jake" />);

  expect(personRenderSpy).toHaveBeenCalledTimes(2);
  expect(screen.getByText(/Jake/)).toHaveTextContent('hello Jake');

  unmount();
});

it('should render the child function when the parents props changes that cause a re-render', () => {
  const { rerender, unmount } = render(<App currentUser="Jake" />);

  rerender(<App currentUser="Finn" />);

  expect(personRenderSpy).toHaveBeenCalledTimes(2);
  expect(screen.getByText(/Finn/)).toHaveTextContent('hello Finn');

  unmount();
});
