import { vertical, horizontal } from '../../../../../../src/state/axis';
import type { Axis } from '../../../../../../src/types';
import { getPreset } from '../../../../../util/dimension';
import getSimpleStatePreset from '../../../../../util/get-simple-state-preset';

export type BlockFnArgs = {
  axis: Axis;
  preset: any;
  state: any;
};

type BlockFn = (args: BlockFnArgs) => void;

export default (block: BlockFn) => {
  [vertical, horizontal].forEach((axis: Axis) => {
    describe(`on the ${axis.direction} axis`, () => {
      beforeEach(() => {
        requestAnimationFrame.reset();
        jest.useFakeTimers();
      });
      afterEach(() => {
        jest.useRealTimers();
      });

      afterAll(() => {
        requestAnimationFrame.reset();
      });

      const preset = getPreset(axis);
      const state = getSimpleStatePreset(axis);

      block({ axis, preset, state });
    });
  });
};
