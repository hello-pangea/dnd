import React, { useMemo } from 'react';
import { mount } from 'enzyme';
import type {
  MapProps,
  DroppableProps,
  DroppableProvided,
  DispatchProps,
  DroppableStateSnapshot,
  Props,
} from '../../../../../src/view/droppable/droppable-types';
import Droppable from '../../../../../src/view/droppable/droppable';
import {
  homeOwnProps,
  homeAtRest,
  dispatchProps as defaultDispatchProps,
} from './get-props';
import getStubber from './get-stubber';
import { getMarshalStub } from '../../../../util/dimension-marshal';
import AppContext from '../../../../../src/view/context/app-context';
import type { AppContextValue } from '../../../../../src/view/context/app-context';
import createRegistry from '../../../../../src/state/registry/create-registry';
import useFocusMarshal from '../../../../../src/view/use-focus-marshal';

type MountArgs = {
  WrappedComponent?: any;
  ownProps?: Required<DroppableProps>;
  mapProps?: MapProps;
  dispatchProps?: DispatchProps;
  isMovementAllowed?: () => boolean;
};

type AppProps = {
  isMovementAllowed: () => boolean;
  WrappedComponent: any;
} & Props;

function App(props: AppProps) {
  const { WrappedComponent, isMovementAllowed, ...rest } = props;
  const contextId = '1';

  const focus = useFocusMarshal(contextId);
  const context: AppContextValue = useMemo(
    () => ({
      focus,
      contextId,
      canLift: () => true,
      isMovementAllowed,
      dragHandleUsageInstructionsId: 'fake-id',
      marshal: getMarshalStub(),
      registry: createRegistry(),
    }),
    [focus, isMovementAllowed],
  );

  return (
    <AppContext.Provider value={context}>
      <Droppable {...rest}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <WrappedComponent provided={provided} snapshot={snapshot} />
        )}
      </Droppable>
    </AppContext.Provider>
  );
}

export default ({
  WrappedComponent = getStubber(),
  ownProps = homeOwnProps,
  mapProps = homeAtRest,
  dispatchProps = defaultDispatchProps,
  isMovementAllowed = () => true,
}: MountArgs = {}) =>
  mount<any>(
    <App
      {...ownProps}
      {...mapProps}
      {...dispatchProps}
      isMovementAllowed={isMovementAllowed}
      WrappedComponent={WrappedComponent}
    />,
  );
