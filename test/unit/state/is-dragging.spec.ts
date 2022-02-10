import isDragging from '../../../src/state/is-dragging';
import getStatePreset from '../../util/get-simple-state-preset';

describe('is dragging', () => {
  it('should return true when it is a DraggingState', () => {
    const draggingState = getStatePreset().dragging();

    expect(isDragging(draggingState)).toBe(true);
  });

  it('should return true when it is a CollectingState', () => {
    const collectingState = getStatePreset().collecting();

    expect(isDragging(collectingState)).toBe(true);
  });

  it('should return true when it is a DropPendingState', () => {
    const dropPendingState = getStatePreset().dropPending();

    expect(isDragging(dropPendingState)).toBe(true);
  });

  it('should return false when it is a IdleState', () => {
    const idleState = getStatePreset().idle;

    expect(isDragging(idleState)).toBe(false);
  });

  it('should return false when it is a DropAnimatingState', () => {
    const dropAnimatingState = getStatePreset().dropAnimating();

    expect(isDragging(dropAnimatingState)).toBe(false);
  });
});
