import React from 'react';
import { useMemo } from 'use-memo-one';
import type { ContextId } from '../../types';

let count = 0;

export function resetDeprecatedUniqueContextId() {
  count = 0;
}

function useDeprecatedUniqueContextId(): ContextId {
  return useMemo(() => `${count++}`, []);
}

function useUniqueContextId(): ContextId {
  return React.useId();
}

// The useId hook is only available in React 18+
export default 'useId' in React
  ? useUniqueContextId
  : useDeprecatedUniqueContextId;
