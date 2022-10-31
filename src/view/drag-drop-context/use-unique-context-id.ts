import React from 'react';
import { useMemo } from 'use-memo-one';
import type { ContextId } from '../../types';

let count = 0;

export function reset() {
  count = 0;
}

export default 'useId' in React
  ? (React.useId as () => ContextId)
  : function useInstanceCount(): ContextId {
      return useMemo(() => `${count++}`, []);
    };
