import React, { Component } from 'react';
import { mount } from 'enzyme';
import type { Provided } from '../../../../src/view/droppable/droppable-types';
import Droppable from '../../../../src/view/droppable/connected-droppable';
import forceUpdate from '../../../util/force-update';
import { DragDropContext } from '../../../../src';

class Person extends Component<{
  name: string;
  provided: Provided;
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
          {(provided: Provided) => (
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
  const wrapper = mount(<App currentUser="Jake" />);

  expect(personRenderSpy).toHaveBeenCalledTimes(1);
  expect(wrapper.find(Person).props().name).toBe('Jake');

  wrapper.unmount();
});

it('should render the child function when the parent re-renders', () => {
  const wrapper = mount(<App currentUser="Jake" />);

  forceUpdate(wrapper);

  expect(personRenderSpy).toHaveBeenCalledTimes(2);
  expect(wrapper.find(Person).props().name).toBe('Jake');

  wrapper.unmount();
});

it('should render the child function when the parents props changes that cause a re-render', () => {
  const wrapper = mount(<App currentUser="Jake" />);

  wrapper.setProps({
    currentUser: 'Finn',
  });

  expect(personRenderSpy).toHaveBeenCalledTimes(2);
  expect(wrapper.find(Person).props().name).toBe('Finn');

  wrapper.unmount();
});
