import React from 'react';
import { render } from '@testing-library/react';
import DragDropContext from '../../../../src/view/drag-drop-context';

it('should not throw when unmounting', () => {
  const { unmount } = render(
    <DragDropContext onDragEnd={() => {}}>{null}</DragDropContext>,
  );

  expect(() => unmount()).not.toThrow();
});

it('should clean up any window event handlers', () => {
  const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

  const { unmount } = render(
    <DragDropContext onDragEnd={() => {}}>{null}</DragDropContext>,
  );

  unmount();

  expect(addEventListenerSpy.mock.calls).toHaveLength(
    removeEventListenerSpy.mock.calls.length,
  );
  // validation
  expect(addEventListenerSpy).toHaveBeenCalled();
  expect(removeEventListenerSpy).toHaveBeenCalled();
});
