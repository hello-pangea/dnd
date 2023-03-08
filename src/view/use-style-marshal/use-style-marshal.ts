import { useRef, MutableRefObject } from 'react';
import memoizeOne from 'memoize-one';
import { useMemo, useCallback } from 'use-memo-one';
import { invariant } from '../../invariant';
import type { StyleMarshal } from './style-marshal-types';
import type { ContextId, DropReason } from '../../types';
import getStyles from './get-styles';
import type { Styles } from './get-styles';
import { prefix } from '../data-attributes';
import useLayoutEffect from '../use-isomorphic-layout-effect';

const getStylesRoot = (stylesInsertionPoint?: HTMLElement|null): HTMLElement => {
  const stylesRoot = stylesInsertionPoint || document.querySelector('head');
  invariant(stylesRoot, 'Cannot find the head or root to append a style to');
  return stylesRoot;
};

const createStyleEl = (nonce?: string): HTMLStyleElement => {
  const el: HTMLStyleElement = document.createElement('style');
  if (nonce) {
    el.setAttribute('nonce', nonce);
  }
  el.type = 'text/css';
  return el;
};

export default function useStyleMarshal(contextId: ContextId, nonce?: string, stylesInsertionPoint?: HTMLElement|null) {
  const styles: Styles = useMemo(() => getStyles(contextId), [contextId]);
  const alwaysRef = useRef<HTMLStyleElement | null>(null);
  const dynamicRef = useRef<HTMLStyleElement | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setDynamicStyle = useCallback(
    // Using memoizeOne to prevent frequent updates to textContext
    memoizeOne((proposed: string) => {
      const el: HTMLStyleElement | null = dynamicRef.current;
      invariant(el, 'Cannot set dynamic style element if it is not set');
      el.textContent = proposed;
    }),
    [],
  );

  const setAlwaysStyle = useCallback((proposed: string) => {
    const el: HTMLStyleElement | null = alwaysRef.current;
    invariant(el, 'Cannot set dynamic style element if it is not set');
    el.textContent = proposed;
  }, []);

  // using layout effect as programatic dragging might start straight away (such as for cypress)
  useLayoutEffect(() => {
    invariant(
      !alwaysRef.current && !dynamicRef.current,
      'style elements already mounted',
    );

    const always: HTMLStyleElement = createStyleEl(nonce);
    const dynamic: HTMLStyleElement = createStyleEl(nonce);

    // store their refs
    alwaysRef.current = always;
    dynamicRef.current = dynamic;

    // for easy identification
    always.setAttribute(`${prefix}-always`, contextId);
    dynamic.setAttribute(`${prefix}-dynamic`, contextId);

    // add style tags to styles root
    const stylesRoot = getStylesRoot(stylesInsertionPoint);
    stylesRoot.appendChild(always);
    stylesRoot.appendChild(dynamic);

    // set initial style
    setAlwaysStyle(styles.always);
    setDynamicStyle(styles.resting);

    return () => {
      const remove = (ref: MutableRefObject<HTMLStyleElement | null>) => {
        const current: HTMLStyleElement | null = ref.current;
        invariant(current, 'Cannot unmount ref as it is not set');
        stylesRoot.removeChild(current);
        ref.current = null;
      };

      remove(alwaysRef);
      remove(dynamicRef);
    };
  }, [
    nonce,
    setAlwaysStyle,
    setDynamicStyle,
    styles.always,
    styles.resting,
    contextId,
    stylesInsertionPoint
  ]);

  const dragging = useCallback(
    () => setDynamicStyle(styles.dragging),
    [setDynamicStyle, styles.dragging],
  );
  const dropping = useCallback(
    (reason: DropReason) => {
      if (reason === 'DROP') {
        setDynamicStyle(styles.dropAnimating);
        return;
      }
      setDynamicStyle(styles.userCancel);
    },
    [setDynamicStyle, styles.dropAnimating, styles.userCancel],
  );
  const resting = useCallback(() => {
    // Can be called defensively
    if (!dynamicRef.current) {
      return;
    }
    setDynamicStyle(styles.resting);
  }, [setDynamicStyle, styles.resting]);

  const marshal: StyleMarshal = useMemo(
    () => ({
      dragging,
      dropping,
      resting,
    }),
    [dragging, dropping, resting],
  );

  return marshal;
}
