import React from 'react';
import type { ReactNode } from 'react';
import type { Responders, ContextId, Sensor } from '../../types';
import ErrorBoundary from './error-boundary';
import { warning } from '../../dev-warning';
import preset from '../../screen-reader-message-preset';
import App from './app';
import useUniqueContextId, {
  resetDeprecatedUniqueContextId,
} from './use-unique-context-id';
import { resetDeprecatedUniqueId } from '../use-unique-id';
import { PartialAutoScrollerOptions } from '../../state/auto-scroller/fluid-scroller/auto-scroller-options-types';

export interface DragDropContextProps extends Responders {
  // We do not technically need any children for this component
  children: ReactNode | null;
  // Read out by screen readers when focusing on a drag handle
  dragHandleUsageInstructions?: string;
  enableDefaultSensors?: boolean | null;
  // Used for strict content security policies
  // See our [content security policy guide](/docs/guides/content-security-policy.md)
  nonce?: string;
  // See our [sensor api](/docs/sensors/sensor-api.md)
  sensors?: Sensor[];
  /**
   * Customize auto scroller
   */
  autoScrollerOptions?: PartialAutoScrollerOptions;
}

// Reset any context that gets persisted across server side renders
export function resetServerContext() {
  // The useId hook is only available in React 18+
  if ('useId' in React) {
    warning(
      `It is not necessary to call resetServerContext when using React 18+`,
    );

    return;
  }

  resetDeprecatedUniqueContextId();
  resetDeprecatedUniqueId();
}

export default function DragDropContext(props: DragDropContextProps) {
  const contextId: ContextId = useUniqueContextId();
  const dragHandleUsageInstructions: string =
    props.dragHandleUsageInstructions || preset.dragHandleUsageInstructions;

  // We need the error boundary to be on the outside of App
  // so that it can catch any errors caused by App
  return (
    <ErrorBoundary>
      {(setCallbacks) => (
        <App
          nonce={props.nonce}
          contextId={contextId}
          setCallbacks={setCallbacks}
          dragHandleUsageInstructions={dragHandleUsageInstructions}
          enableDefaultSensors={props.enableDefaultSensors}
          sensors={props.sensors}
          onBeforeCapture={props.onBeforeCapture}
          onBeforeDragStart={props.onBeforeDragStart}
          onDragStart={props.onDragStart}
          onDragUpdate={props.onDragUpdate}
          onDragEnd={props.onDragEnd}
          autoScrollerOptions={props.autoScrollerOptions}
        >
          {props.children}
        </App>
      )}
    </ErrorBoundary>
  );
}
