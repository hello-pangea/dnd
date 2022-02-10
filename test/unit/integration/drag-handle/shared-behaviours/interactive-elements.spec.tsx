import React from 'react';
import { render } from '@testing-library/react';
import { forEachSensor, simpleLift } from '../../util/controls';
import type { Control } from '../../util/controls';
import { isDragging } from '../../util/helpers';
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '../../../../../src';
import App from '../../util/app';
import type { Item } from '../../util/app';
import {
  interactiveTagNames,
  InteractiveTagName,
} from '../../../../../src/view/use-sensor-marshal/is-event-in-interactive-element';
import { disableError } from '../../../../util/console';

const mixedCase = [
  ...interactiveTagNames,
  // React can render UPPER case element e.g. "INPUT"
  // @types/react do not support createElement with upper case
  // string, so we are lying here and do not say that the strings
  // are uppercase using `Uppercase<keyof InteractiveTagNames>`
  ...interactiveTagNames.map((s) => s.toUpperCase() as InteractiveTagName),
];

forEachSensor((control: Control) => {
  // react will log a warning if using upper case
  disableError();

  it('should not drag if the handle is an interactive element', () => {
    mixedCase.forEach((tagName) => {
      const renderItem = (item: Item) => (
        provided: DraggableProvided,
        snapshot: DraggableStateSnapshot,
      ) => {
        const TagName = tagName;
        return (
          <TagName
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            data-is-dragging={snapshot.isDragging}
            data-testid={item.id}
          />
        );
      };

      const { unmount, getByTestId } = render(<App renderItem={renderItem} />);
      const handle: HTMLElement = getByTestId('0');

      simpleLift(control, handle);

      expect(isDragging(handle)).toBe(false);

      unmount();
    });
  });

  it('should allow dragging from an interactive handle if instructed', () => {
    mixedCase.forEach((tagName) => {
      const items: Item[] = [{ id: '0', canDragInteractiveElements: true }];
      const renderItem = (item: Item) => (
        provided: DraggableProvided,
        snapshot: DraggableStateSnapshot,
      ) => {
        const TagName = tagName;
        return (
          <TagName
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            data-is-dragging={snapshot.isDragging}
            data-testid={item.id}
          />
        );
      };

      const { unmount, getByTestId } = render(
        <App items={items} renderItem={renderItem} />,
      );
      const handle: HTMLElement = getByTestId('0');

      simpleLift(control, handle);

      expect(isDragging(handle)).toBe(true);

      unmount();
    });
  });

  it('should not start a drag if the parent is interactive', () => {
    mixedCase.forEach((tagName) => {
      const renderItem = (item: Item) => (
        provided: DraggableProvided,
        snapshot: DraggableStateSnapshot,
      ) => {
        const TagName = tagName;
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            data-is-dragging={snapshot.isDragging}
            data-testid={`handle-${item.id}`}
          >
            <TagName data-testid={`inner-${item.id}`} />
          </div>
        );
      };

      const { unmount, getByTestId } = render(<App renderItem={renderItem} />);
      const inner: HTMLElement = getByTestId('inner-0');
      const handle: HTMLElement = getByTestId('handle-0');

      simpleLift(control, inner);

      expect(isDragging(handle)).toBe(false);

      unmount();
    });
  });

  it('should allow dragging from with an interactive parent if instructed', () => {
    mixedCase.forEach((tagName) => {
      const items: Item[] = [{ id: '0', canDragInteractiveElements: true }];
      const renderItem = (item: Item) => (
        provided: DraggableProvided,
        snapshot: DraggableStateSnapshot,
      ) => {
        const TagName = tagName;
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            data-is-dragging={snapshot.isDragging}
            data-testid={`handle-${item.id}`}
          >
            <TagName data-testid={`inner-${item.id}`} />
          </div>
        );
      };

      const { unmount, getByTestId } = render(
        <App items={items} renderItem={renderItem} />,
      );
      const handle: HTMLElement = getByTestId('handle-0');
      const inner: HTMLElement = getByTestId('inner-0');

      simpleLift(control, inner);

      expect(isDragging(handle)).toBe(true);

      unmount();
    });
  });
});
