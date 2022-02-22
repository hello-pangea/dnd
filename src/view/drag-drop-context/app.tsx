import React, { useEffect, useRef } from 'react';
import type { ReactNode, MutableRefObject } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { Provider } from 'react-redux';
import { useMemo, useCallback } from 'use-memo-one';
import { invariant } from '../../invariant';
import createStore from '../../state/create-store';
import createDimensionMarshal from '../../state/dimension-marshal/dimension-marshal';
import canStartDrag from '../../state/can-start-drag';
import scrollWindow from '../window/scroll-window';
import createAutoScroller from '../../state/auto-scroller';
import useStyleMarshal from '../use-style-marshal/use-style-marshal';
import useFocusMarshal from '../use-focus-marshal';
import useRegistry from '../../state/registry/use-registry';
import type { Registry } from '../../state/registry/registry-types';
import type { FocusMarshal } from '../use-focus-marshal/focus-marshal-types';
import type { AutoScroller } from '../../state/auto-scroller/auto-scroller-types';
import type { StyleMarshal } from '../use-style-marshal/style-marshal-types';
import type {
  DimensionMarshal,
  Callbacks as DimensionMarshalCallbacks,
} from '../../state/dimension-marshal/dimension-marshal-types';
import type {
  DraggableId,
  State,
  Responders,
  Announce,
  Sensor,
  ElementId,
} from '../../types';
import type { Store, Action } from '../../state/store-types';
import type { SetAppCallbacks, AppCallbacks } from './drag-drop-context-types';
import StoreContext from '../context/store-context';
import {
  move,
  publishWhileDragging,
  updateDroppableScroll,
  updateDroppableIsEnabled,
  updateDroppableIsCombineEnabled,
  collectionStarting,
  flush,
} from '../../state/action-creators';
import isMovementAllowed from '../../state/is-movement-allowed';
import useAnnouncer from '../use-announcer';
import useHiddenTextElement from '../use-hidden-text-element';
import AppContext from '../context/app-context';
import type { AppContextValue } from '../context/app-context';
import useStartupValidation from './use-startup-validation';
import usePrevious from '../use-previous-ref';
import { warning } from '../../dev-warning';
import useSensorMarshal from '../use-sensor-marshal/use-sensor-marshal';

export interface Props extends Responders {
  contextId: string;
  setCallbacks: SetAppCallbacks;
  nonce?: string;
  // we do not technically need any children for this component
  children: ReactNode | null;
  // sensors
  sensors?: Sensor[];
  enableDefaultSensors?: boolean | null;
  // screen reader
  dragHandleUsageInstructions: string;
}

const createResponders = (props: Props): Responders => ({
  onBeforeCapture: props.onBeforeCapture,
  onBeforeDragStart: props.onBeforeDragStart,
  onDragStart: props.onDragStart,
  onDragEnd: props.onDragEnd,
  onDragUpdate: props.onDragUpdate,
});

type LazyStoreRef = MutableRefObject<Store | null>;

function getStore(lazyRef: LazyStoreRef): Store {
  invariant(lazyRef.current, 'Could not find store from lazy ref');
  return lazyRef.current;
}

export default function App(props: Props) {
  const {
    contextId,
    setCallbacks,
    sensors,
    nonce,
    dragHandleUsageInstructions,
  } = props;
  const lazyStoreRef: LazyStoreRef = useRef<Store | null>(null);

  useStartupValidation();

  // lazy collection of responders using a ref - update on ever render
  const lastPropsRef = usePrevious<Props>(props);

  const getResponders: () => Responders = useCallback(() => {
    return createResponders(lastPropsRef.current);
  }, [lastPropsRef]);

  const announce: Announce = useAnnouncer(contextId);

  const dragHandleUsageInstructionsId: ElementId = useHiddenTextElement({
    contextId,
    text: dragHandleUsageInstructions,
  });
  const styleMarshal: StyleMarshal = useStyleMarshal(contextId, nonce);

  const lazyDispatch: (a: Action) => void = useCallback(
    (action: Action): void => {
      getStore(lazyStoreRef).dispatch(action);
    },
    [],
  );

  const marshalCallbacks: DimensionMarshalCallbacks = useMemo(
    () =>
      bindActionCreators(
        {
          publishWhileDragging,
          updateDroppableScroll,
          updateDroppableIsEnabled,
          updateDroppableIsCombineEnabled,
          collectionStarting,
        },
        lazyDispatch as Dispatch,
      ),
    [lazyDispatch],
  );

  const registry: Registry = useRegistry();

  const dimensionMarshal: DimensionMarshal = useMemo<DimensionMarshal>(() => {
    return createDimensionMarshal(registry, marshalCallbacks);
  }, [registry, marshalCallbacks]);

  const autoScroller: AutoScroller = useMemo<AutoScroller>(
    () =>
      createAutoScroller({
        scrollWindow,
        scrollDroppable: dimensionMarshal.scrollDroppable,
        ...bindActionCreators(
          {
            move,
          } as const,
          lazyDispatch as Dispatch,
        ),
      }),
    [dimensionMarshal.scrollDroppable, lazyDispatch],
  );

  const focusMarshal: FocusMarshal = useFocusMarshal(contextId);

  const store: Store = useMemo<Store>(
    () =>
      createStore({
        announce,
        autoScroller,
        dimensionMarshal,
        focusMarshal,
        getResponders,
        styleMarshal,
      }),
    [
      announce,
      autoScroller,
      dimensionMarshal,
      focusMarshal,
      getResponders,
      styleMarshal,
    ],
  );

  // Checking for unexpected store changes
  if (process.env.NODE_ENV !== 'production') {
    if (lazyStoreRef.current && lazyStoreRef.current !== store) {
      warning('unexpected store change');
    }
  }

  // assigning lazy store ref
  lazyStoreRef.current = store;

  const tryResetStore = useCallback(() => {
    const current: Store = getStore(lazyStoreRef);
    const state: State = current.getState();
    if (state.phase !== 'IDLE') {
      current.dispatch(flush());
    }
  }, []);

  const isDragging = useCallback((): boolean => {
    const state: State = getStore(lazyStoreRef).getState();

    if (state.phase === 'DROP_ANIMATING') {
      return true;
    }

    if (state.phase === 'IDLE') {
      return false;
    }

    return state.isDragging;
  }, []);

  const appCallbacks: AppCallbacks = useMemo(
    () => ({
      isDragging,
      tryAbort: tryResetStore,
    }),
    [isDragging, tryResetStore],
  );

  // doing this in render rather than a side effect so any errors on the
  // initial mount are caught
  setCallbacks(appCallbacks);

  const getCanLift = useCallback(
    (id: DraggableId) => canStartDrag(getStore(lazyStoreRef).getState(), id),
    [],
  );

  const getIsMovementAllowed = useCallback(
    () => isMovementAllowed(getStore(lazyStoreRef).getState()),
    [],
  );

  const appContext: AppContextValue = useMemo(
    () => ({
      marshal: dimensionMarshal,
      focus: focusMarshal,
      contextId,
      canLift: getCanLift,
      isMovementAllowed: getIsMovementAllowed,
      dragHandleUsageInstructionsId,
      registry,
    }),
    [
      contextId,
      dimensionMarshal,
      dragHandleUsageInstructionsId,
      focusMarshal,
      getCanLift,
      getIsMovementAllowed,
      registry,
    ],
  );

  useSensorMarshal({
    contextId,
    store,
    registry,
    customSensors: sensors || null,
    // default to 'true' unless 'false' is explicitly passed
    enableDefaultSensors: props.enableDefaultSensors !== false,
  });

  // Clean store when unmounting
  useEffect(() => {
    return tryResetStore;
  }, [tryResetStore]);

  return (
    <AppContext.Provider value={appContext}>
      {/*
        There are typings issues which prevent us from properly type the store context
        see: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/dfec9e88385b279a94076c46a1cc4527ae657532/types/react-redux/index.d.ts#L482
       */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Provider context={StoreContext as any} store={store}>
        {props.children}
      </Provider>
    </AppContext.Provider>
  );
}
