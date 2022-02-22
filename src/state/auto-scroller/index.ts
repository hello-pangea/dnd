import type { Position } from 'css-box-model';
import createFluidScroller from './fluid-scroller';
import type { FluidScroller } from './fluid-scroller';
import createJumpScroller from './jump-scroller';
import type { JumpScroller } from './jump-scroller';
import type { AutoScroller } from './auto-scroller-types';
import type { DroppableId, State } from '../../types';
import type { MoveArgs } from '../action-creators';

export interface Args {
  scrollWindow: (offset: Position) => void;
  scrollDroppable: (id: DroppableId, change: Position) => void;
  move: (args: MoveArgs) => unknown;
}

export default ({
  scrollDroppable,
  scrollWindow,
  move,
}: Args): AutoScroller => {
  const fluidScroller: FluidScroller = createFluidScroller({
    scrollWindow,
    scrollDroppable,
  });

  const jumpScroll: JumpScroller = createJumpScroller({
    move,
    scrollWindow,
    scrollDroppable,
  });

  const scroll = (state: State) => {
    // Only allowing auto scrolling in the DRAGGING phase
    if (state.phase !== 'DRAGGING') {
      return;
    }

    if (state.movementMode === 'FLUID') {
      fluidScroller.scroll(state);
      return;
    }

    if (!state.scrollJumpRequest) {
      return;
    }

    jumpScroll(state);
  };

  const scroller: AutoScroller = {
    scroll,
    start: fluidScroller.start,
    stop: fluidScroller.stop,
  };

  return scroller;
};
