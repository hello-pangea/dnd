// This file exists to avoid a circular dependency between types.js and action-creators.js
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import type { Action } from './action-creators';
import type { State } from '../types';

export type {
  Action,
  BeforeInitialCaptureAction,
  LiftAction,
  InitialPublishAction,
  PublishWhileDraggingAction,
  CollectionStartingAction,
  UpdateDroppableScrollAction,
  UpdateDroppableIsEnabledAction,
  UpdateDroppableIsCombineEnabledAction,
  MoveByWindowScrollAction,
  UpdateViewportMaxScrollAction,
  MoveAction,
  MoveUpAction,
  MoveDownAction,
  MoveRightAction,
  MoveLeftAction,
  DropPendingAction,
  DropAction,
  DropAnimateAction,
  DropAnimationFinishedAction,
  DropCompleteAction,
  FlushAction,
} from './action-creators';

export type Dispatch = ReduxDispatch<Action>;
export type Store = ReduxStore<State, Action>;
export interface MiddlewareStore {
  dispatch: Dispatch;
  getState(): State;
}
export interface Middleware {
  (api: MiddlewareStore): (next: Dispatch) => (action: Action) => unknown;
}
