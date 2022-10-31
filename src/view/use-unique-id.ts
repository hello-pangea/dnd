import React from 'react';
import { useMemo } from 'use-memo-one';
import type { Id } from '../types';

let count = 0;

interface Options {
  separator: string;
}

const defaults: Options = { separator: '::' };

export function reset() {
  count = 0;
}

export default 'useId' in React
  ? function useUniqueId(prefix: string, options: Options = defaults): Id {
      const id = React.useId();

      return useMemo(
        () => `${prefix}${options.separator}${id}`,
        [options.separator, prefix, id],
      );
    }
  : function useUniqueId(prefix: string, options: Options = defaults): Id {
      return useMemo(
        () => `${prefix}${options.separator}${count++}`,
        [options.separator, prefix],
      );
    };
