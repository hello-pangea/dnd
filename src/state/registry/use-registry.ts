import React, { useEffect } from 'react';
import { useMemo } from 'use-memo-one';
import type { Registry } from './registry-types';
import createRegistry from './create-registry';

export default function useRegistry(): Registry {
  const registry: Registry = useMemo(createRegistry, []);

  useEffect(() => {
    // clean up the registry to avoid any leaks
    return function unmount() {
      // FIXME: we do not know if this is still needed, but to make sure we do not
      //        break any existing existing code using react 16 and 17 we'll
      //        continue to clean up after an animation frame
      //
      //        The requestAnimationFrame polyfill was added in this commit:
      //        https://github.com/atlassian/react-beautiful-dnd/pull/1487/commits/8bdffb9d077b0009400620d9cf6575bba7af13dc#diff-b3b2de485fa432e394aebc8abf54be40ad7fac9b39a2ed818fddfd56f1786c53
      if (React.version.startsWith('16') || React.version.startsWith('17')) {
        // doing it after an animation frame so that other things unmounting
        // can continue to interact with the registry
        requestAnimationFrame(registry.clean);
      } else {
        // starting with react v18, we must invoke clean immediately
        // we won't be able to access the registry after the unmount
        // more details here: https://beta.reactjs.org/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
        registry.clean();
      }
    };
  }, [registry]);

  return registry;
}
