import { useRef, MutableRefObject } from 'react';
import { useMemo, useCallback } from '../../use-memo-one';
import { memoizeOne } from '../../memoize-one';
import { invariant } from '../../invariant';
import type { StyleMarshal } from './style-marshal-types';
import type { ContextId, DropReason } from '../../types';
import getStyles from './get-styles';
import type { Styles } from './get-styles';
import { prefix } from '../data-attributes';
import useLayoutEffect from '../use-isomorphic-layout-effect';

const getHead = (targetDoc?: Document): HTMLHeadElement | null => {
  if (!targetDoc) return null;
  const head: HTMLHeadElement | null = targetDoc.querySelector('head');
  if (targetDoc && !head) {
    invariant(false, 'Cannot find the head to append a style to in the provided document');
  }
  return head;
};

const createStyleEl = (targetDoc?: Document, nonce?: string): HTMLStyleElement | null => {
  if (!targetDoc) return null;
  const el: HTMLStyleElement = targetDoc.createElement('style');
  if (nonce) {
    el.setAttribute('nonce', nonce);
  }
  el.type = 'text/css';
  return el;
};

export default function useStyleMarshal(
  contextId: ContextId,
  nonce?: string,
  targetDocFromApp?: Document
): StyleMarshal {
  // Determine the effective document to use:
  // 1. Use the one passed from App (targetDocFromApp).
  // 2. If not passed, fallback to global document if it exists (for direct test usage or other contexts).
  // 3. If global document also doesn't exist (SSR context where app.tsx also found it undefined), it remains undefined.
  const effectiveTargetDoc = targetDocFromApp || (typeof document !== 'undefined' ? document : undefined);

  const styles: Styles = useMemo(() => getStyles(contextId), [contextId]);
  const alwaysRef = useRef<HTMLStyleElement | null>(null);
  const dynamicRef = useRef<HTMLStyleElement | null>(null);

  const setDynamicStyle = useCallback(
    memoizeOne((proposed: string) => {
      const el: HTMLStyleElement | null = dynamicRef.current;
      if (el) {
        el.textContent = proposed;
      }
    }),
    [],
  );

  const setAlwaysStyle = useCallback((proposed: string) => {
    const el: HTMLStyleElement | null = alwaysRef.current;
    if (el) {
      el.textContent = proposed;
    }
  }, []);

  useLayoutEffect(() => {
    if (!effectiveTargetDoc) { // Use the determined effectiveTargetDoc
      return;
    }

    invariant(
      !alwaysRef.current && !dynamicRef.current,
      'style elements already mounted',
    );

    const always: HTMLStyleElement | null = createStyleEl(effectiveTargetDoc, nonce);
    const dynamic: HTMLStyleElement | null = createStyleEl(effectiveTargetDoc, nonce);
    
    if (!always || !dynamic) {
        return;
    }

    alwaysRef.current = always;
    dynamicRef.current = dynamic;

    always.setAttribute(`${prefix}-always`, contextId);
    dynamic.setAttribute(`${prefix}-dynamic`, contextId);

    const head = getHead(effectiveTargetDoc);
    if (head) {
        head.appendChild(always);
        head.appendChild(dynamic);
    }

    setAlwaysStyle(styles.always);
    setDynamicStyle(styles.resting);

    return () => {
      if (!effectiveTargetDoc) { // Use the determined effectiveTargetDoc
        return;
      }

      const remove = (ref: MutableRefObject<HTMLStyleElement | null>) => {
        const current: HTMLStyleElement | null = ref.current;
        if (current) {
            const head = getHead(effectiveTargetDoc); // Use effectiveTargetDoc
            if (head && head.contains(current)) { 
                 head.removeChild(current);
            }
            ref.current = null;
        }
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
    effectiveTargetDoc, // Depend on effectiveTargetDoc
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
    // Use effectiveTargetDoc for condition consistency
    if (!dynamicRef.current && !effectiveTargetDoc) { 
      return;
    }
    setDynamicStyle(styles.resting);
  }, [setDynamicStyle, styles.resting, effectiveTargetDoc]); // Depend on effectiveTargetDoc

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
