import { makeMapStateToProps } from '../../../../src/view/draggable/connected-draggable';
import { getPreset } from '../../../util/dimension';
import getStatePreset from '../../../util/get-simple-state-preset';
import getOwnProps from './util/get-own-props';
import type {
  Selector,
  OwnProps,
  MapProps,
} from '../../../../src/view/draggable/draggable-types';
import type { State } from '../../../../src/types';

const preset = getPreset();
const state = getStatePreset();

it('should not break memoization across selectors', () => {
  const inHome1Selector: Selector = makeMapStateToProps();
  const inHome1OwnProps: OwnProps = getOwnProps(preset.inHome1);
  const inForeign1Selector: Selector = makeMapStateToProps();
  const inForeign1OwnProps: OwnProps = getOwnProps(preset.inForeign2);
  const defaultInForeign1MapProps: MapProps = inForeign1Selector(
    state.idle,
    inForeign1OwnProps,
  );

  state.allPhases(preset.inHome1.descriptor.id).forEach((current: State) => {
    // independent selector
    inHome1Selector(current, inHome1OwnProps);
    // should not break memoization of inForeign1
    expect(inForeign1Selector(current, inForeign1OwnProps)).toBe(
      defaultInForeign1MapProps,
    );
  });
});
