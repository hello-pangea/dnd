import getStatePreset from '../../../util/get-simple-state-preset';
import { makeMapStateToProps } from '../../../../src/view/droppable/connected-droppable';
import type {
  DraggingState,
  DragImpact,
  DisplacedBy,
  Combine,
} from '../../../../src/types';
import type {
  OwnProps,
  Selector,
  MapProps,
} from '../../../../src/view/droppable/droppable-types';
import getOwnProps from './util/get-own-props';
import { getPreset } from '../../../util/dimension';
import { move, withImpact } from '../../../util/dragging-state';
import type { IsDraggingState } from '../../../util/dragging-state';
import noImpact, { emptyGroups } from '../../../../src/state/no-impact';
import getDisplacedBy from '../../../../src/state/get-displaced-by';
import withCombineImpact from './util/with-combine-impact';
import restingProps from './util/resting-props';

const preset = getPreset();
const state = getStatePreset();

describe('home list', () => {
  const ownProps: OwnProps = getOwnProps(preset.home);
  const isOverMapProps: MapProps = {
    placeholder: preset.inHome1.placeholder,
    shouldAnimatePlaceholder: false,
    snapshot: {
      isDraggingOver: true,
      draggingOverWith: preset.inHome1.descriptor.id,
      draggingFromThisWith: preset.inHome1.descriptor.id,
      isUsingPlaceholder: true,
    },
    useClone: null,
  };

  describe('is dragging over', () => {
    it('should indicate that it is being dragged over', () => {
      const selector: Selector = makeMapStateToProps();
      const props: MapProps = selector(
        state.dragging(preset.inHome1.descriptor.id),
        ownProps,
      );

      expect(props).toEqual(isOverMapProps);
    });

    it('should indicate that it is being combined over', () => {
      const selector: Selector = makeMapStateToProps();
      const base: IsDraggingState = state.dragging(
        preset.inHome1.descriptor.id,
      );
      const combine: Combine = {
        draggableId: preset.inHome2.descriptor.id,
        droppableId: preset.home.descriptor.id,
      };
      const withCombine: IsDraggingState = withImpact(
        base,
        withCombineImpact(base.impact, combine),
      );
      const props: MapProps = selector(withCombine, ownProps);

      expect(props).toEqual(isOverMapProps);
    });

    it('should not break memoization between moves', () => {
      const selector: Selector = makeMapStateToProps();
      const base: DraggingState = state.dragging(preset.inHome1.descriptor.id);

      const first: IsDraggingState = move(base, { x: 1, y: 1 });
      const second: IsDraggingState = move(first, { x: 0, y: 1 });
      const third: IsDraggingState = move(second, { x: -1, y: 0 });
      const combine: Combine = {
        draggableId: preset.inHome2.descriptor.id,
        droppableId: preset.home.descriptor.id,
      };
      const fourth: IsDraggingState = withImpact(
        third,
        withCombineImpact(third.impact, combine),
      );
      const props1: MapProps = selector(first, ownProps);
      const props2: MapProps = selector(second, ownProps);
      const props3: MapProps = selector(third, ownProps);
      const props4: MapProps = selector(fourth, ownProps);

      expect(props1).toEqual(isOverMapProps);
      // memoization check
      expect(props2).toBe(props1);
      expect(props3).toBe(props1);
      expect(props4).toBe(props1);
    });
  });

  describe('is not dragging over', () => {
    const getNoWhere = (): DraggingState => ({
      ...state.dragging(preset.inHome1.descriptor.id),
      impact: { ...noImpact },
    });

    const isHomeButNotOver: MapProps = {
      placeholder: preset.inHome1.placeholder,
      shouldAnimatePlaceholder: false,
      snapshot: {
        isDraggingOver: false,
        draggingOverWith: null,
        draggingFromThisWith: preset.inHome1.descriptor.id,
        isUsingPlaceholder: true,
      },
      useClone: null,
    };

    it('should indicate that it is not being dragged over', () => {
      const selector: Selector = makeMapStateToProps();

      const first: MapProps = selector(getNoWhere(), ownProps);
      expect(first).toEqual(isHomeButNotOver);
    });

    it('should not break memoization between moves', () => {
      const selector: Selector = makeMapStateToProps();

      const first: MapProps = selector(getNoWhere(), ownProps);
      expect(first).toEqual(isHomeButNotOver);

      expect(selector(move(getNoWhere(), { x: 1, y: 1 }), ownProps)).toBe(
        first,
      );
      expect(selector(move(getNoWhere(), { x: 1, y: 1 }), ownProps)).toBe(
        first,
      );
      expect(selector(move(getNoWhere(), { x: 1, y: 1 }), ownProps)).toBe(
        first,
      );
      const combine: Combine = {
        draggableId: preset.inForeign1.descriptor.id,
        droppableId: preset.foreign.descriptor.id,
      };
      const withCombine: IsDraggingState = withImpact(
        state.dragging(),
        withCombineImpact(state.dragging().impact, combine),
      );
      expect(selector(withCombine, ownProps)).toBe(first);
    });
  });
});

describe('foreign list', () => {
  const ownProps: OwnProps = getOwnProps(preset.foreign);

  describe('is dragging over', () => {
    const displacedBy: DisplacedBy = getDisplacedBy(
      preset.foreign.axis,
      preset.inHome1.displaceBy,
    );
    const overForeign: DragImpact = {
      displaced: emptyGroups,
      displacedBy,
      at: {
        type: 'REORDER',
        destination: {
          index: 0,
          droppableId: preset.foreign.descriptor.id,
        },
      },
    };

    const isOverForeignMapProps: MapProps = {
      placeholder: preset.inHome1.placeholder,
      shouldAnimatePlaceholder: true,
      snapshot: {
        isDraggingOver: true,
        draggingFromThisWith: null,
        draggingOverWith: preset.inHome1.descriptor.id,
        isUsingPlaceholder: true,
      },
      useClone: null,
    };

    it('should indicate that it is being dragged over', () => {
      const selector: Selector = makeMapStateToProps();
      const current: IsDraggingState = withImpact(
        state.dragging(preset.inHome1.descriptor.id),
        overForeign,
      );
      const props: MapProps = selector(current, ownProps);

      expect(props).toEqual(isOverForeignMapProps);
    });
    it('should indicate that it is being combined over', () => {
      const selector: Selector = makeMapStateToProps();
      const base: IsDraggingState = state.dragging(
        preset.inHome1.descriptor.id,
      );
      const combine: Combine = {
        draggableId: preset.inForeign1.descriptor.id,
        droppableId: preset.foreign.descriptor.id,
      };
      const withCombine: IsDraggingState = withImpact(
        base,
        withCombineImpact(base.impact, combine),
      );
      const props: MapProps = selector(withCombine, ownProps);
      expect(props).toEqual(isOverForeignMapProps);
    });

    it('should not break memoization between moves', () => {
      const selector: Selector = makeMapStateToProps();
      const base: IsDraggingState = withImpact(
        state.dragging(preset.inHome1.descriptor.id),
        overForeign,
      );
      const first: IsDraggingState = move(base, { x: 1, y: 1 });
      const second: IsDraggingState = move(first, { x: 0, y: 1 });
      const third: IsDraggingState = move(second, { x: -1, y: 0 });
      const props1: MapProps = selector(first, ownProps);
      const props2: MapProps = selector(second, ownProps);
      const props3: MapProps = selector(third, ownProps);

      expect(props1).toEqual(isOverForeignMapProps);
      // memoization check
      expect(props2).toBe(props1);
      expect(props3).toBe(props1);
    });
  });

  describe('is not dragging over', () => {
    const getNoWhere = (): DraggingState => ({
      ...state.dragging(preset.inHome1.descriptor.id),
      impact: { ...noImpact },
    });

    const isNotOver: MapProps = {
      ...restingProps,
      shouldAnimatePlaceholder: true,
    };

    it('should indicate that it is not being dragged over', () => {
      const selector: Selector = makeMapStateToProps();

      const first: MapProps = selector(getNoWhere(), ownProps);
      expect(first).toEqual(isNotOver);
    });

    it('should not break memoization between moves', () => {
      const selector: Selector = makeMapStateToProps();

      const first: MapProps = selector(getNoWhere(), ownProps);
      expect(first).toEqual(isNotOver);

      expect(selector(move(getNoWhere(), { x: 1, y: 1 }), ownProps)).toBe(
        first,
      );
      expect(selector(move(getNoWhere(), { x: 1, y: 1 }), ownProps)).toBe(
        first,
      );
      expect(selector(move(getNoWhere(), { x: 1, y: 1 }), ownProps)).toBe(
        first,
      );
    });
  });
});
