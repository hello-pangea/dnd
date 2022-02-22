import type { Position } from 'css-box-model';
import { bindActionCreators, Dispatch as ReduxDispatch } from 'redux';
import type { Dispatch } from '../../src/state/store-types';
import create from '../../src/state/dimension-marshal/dimension-marshal';
import type {
  CollectionStartingAction,
  PublishWhileDraggingAction,
  PublishWhileDraggingArgs,
  UpdateDroppableScrollAction,
  UpdateDroppableScrollArgs,
  UpdateDroppableIsEnabledAction,
  UpdateDroppableIsEnabledArgs,
  UpdateDroppableIsCombineEnabledAction,
  UpdateDroppableIsCombineEnabledArgs,
} from '../../src/state/action-creators';
import type { DroppableId, LiftRequest } from '../../src/types';
import {
  collectionStarting,
  publishWhileDragging,
  updateDroppableScroll,
  updateDroppableIsEnabled,
  updateDroppableIsCombineEnabled,
} from '../../src/state/action-creators';
import type {
  DimensionMarshal,
  StartPublishingResult,
} from '../../src/state/dimension-marshal/dimension-marshal-types';
import type { Registry } from '../../src/state/registry/registry-types';
import { critical, preset } from './preset-action-args';

export const createMarshal = (
  registry: Registry,
  dispatch: Dispatch,
): DimensionMarshal => {
  const callbacks = bindActionCreators(
    {
      publishWhileDragging,
      collectionStarting,
      updateDroppableScroll,
      updateDroppableIsEnabled,
      updateDroppableIsCombineEnabled,
    },
    // Redux types are not optimal. They should pass the Action to the Dispatch, but
    // instead they directly use the Dispatch which end up to be Dispatch<AnyAction>.
    // The type should be like this instead.
    // TODO: Open a PR to fix the issue.
    //
    // ```ts
    // export function bindActionCreators<A, C extends ActionCreator<A>>(
    //   actionCreator: C,
    //   dispatch: Dispatch<A>
    // ): C
    // ```
    //
    // See: https://github.com/reduxjs/redux/blob/83af794b06ca253c03235f28d1d3a33d8eba2b6f/index.d.ts#L568
    dispatch as ReduxDispatch,
  );

  return create(registry, callbacks);
};

export const getMarshalStub = () => ({
  updateDroppableScroll: jest.fn<void, [id: string, newScroll: Position]>(),
  updateDroppableIsEnabled: jest.fn<
    void,
    [id: DroppableId, isEnabled: boolean]
  >(),
  updateDroppableIsCombineEnabled: jest.fn<
    void,
    [id: DroppableId, isEnabled: boolean]
  >(),
  scrollDroppable: jest.fn<void, [id: DroppableId, change: Position]>(),
  startPublishing: jest.fn<StartPublishingResult, [LiftRequest]>(() => ({
    critical,
    viewport: preset.viewport,
    dimensions: {
      draggables: {
        [preset.inHome1.descriptor.id]: preset.inHome1,
        [preset.inHome2.descriptor.id]: preset.inHome2,
      },
      droppables: {
        [preset.home.descriptor.id]: preset.home,
      },
    },
  })),
  stopPublishing: jest.fn<void, []>(),
});

export const getCallbacksStub = () => ({
  publishWhileDragging: jest.fn<
    PublishWhileDraggingAction,
    [PublishWhileDraggingArgs]
  >(publishWhileDragging),
  updateDroppableScroll: jest.fn<
    UpdateDroppableScrollAction,
    [UpdateDroppableScrollArgs]
  >(updateDroppableScroll),
  updateDroppableIsEnabled: jest.fn<
    UpdateDroppableIsEnabledAction,
    [UpdateDroppableIsEnabledArgs]
  >(updateDroppableIsEnabled),
  updateDroppableIsCombineEnabled: jest.fn<
    UpdateDroppableIsCombineEnabledAction,
    [UpdateDroppableIsCombineEnabledArgs]
  >(updateDroppableIsCombineEnabled),
  collectionStarting: jest.fn<CollectionStartingAction, []>(collectionStarting),
});
