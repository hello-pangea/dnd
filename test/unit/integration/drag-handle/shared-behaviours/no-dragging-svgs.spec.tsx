import React from 'react';
import { render } from '@testing-library/react';
import { invariant } from '../../../../../src/invariant';
import { forEachSensor, simpleLift } from '../../util/controls';
import type { Control } from '../../util/controls';
import { isDragging } from '../../util/helpers';
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '../../../../../src';
import App from '../../util/app';
import type { Item } from '../../util/app';
import { withWarn, withError } from '../../../../util/console';

forEachSensor((control: Control) => {
  it('should not start a drag from an SVG', () => {
    const renderItem =
      (item: Item) =>
      (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          data-is-dragging={snapshot.isDragging}
          data-testid={`draggable-${item.id}`}
        >
          <svg
            {...provided.dragHandleProps}
            data-testid={`handle-${item.id}`}
          />
        </div>
      );

    const spyable = { render };
    const renderSpy = jest.spyOn(spyable, 'render');
    // this is a setup problem: a drag handle cannot be a svg
    withWarn(() => {
      withError(() => {
        spyable.render(<App renderItem={renderItem} />);
      });
    });
    const result = renderSpy.mock.results?.[0];
    invariant(result.type === 'return');
    const api = result.value;
    invariant(api);
    const draggable = api.getByTestId('draggable-0');
    const handle = api.getByTestId('handle-0');

    withWarn(() => {
      simpleLift(control, handle);
    });

    expect(isDragging(draggable)).toBe(false);
  });

  it('should allow an SVG within a draggable', () => {
    const renderItem =
      (item: Item) =>
      (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          data-is-dragging={snapshot.isDragging}
          data-testid={`draggable-${item.id}`}
        >
          <svg data-testid={`svg-${item.id}`} />
        </div>
      );
    const { getByTestId } = render(<App renderItem={renderItem} />);
    const draggable = getByTestId('draggable-0');
    const startFrom = getByTestId('svg-0');

    simpleLift(control, startFrom);

    expect(isDragging(draggable)).toBe(true);
  });
});
