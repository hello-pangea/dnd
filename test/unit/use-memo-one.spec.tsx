/**
 * Original author: Alex Reardon
 * License: MIT
 * Repo: https://github.com/alexreardon/use-memo-one
 * Description: useMemo and useCallback but with a stable cache.
 */

import React, { type ReactNode } from 'react';
import { render } from '@testing-library/react';
import { useMemo, useCallback } from '../../src/use-memo-one';

describe('useCallback', () => {
  interface WithCallbackProps {
    inputs: unknown[];
    children: (value: unknown) => ReactNode;
    callback: () => void;
  }

  function WithCallback(props: WithCallbackProps) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fn = useCallback(props.callback, props.inputs);

    return props.children(fn);
  }

  it('should return the passed callback until there is an input change', () => {
    const mock = jest.fn().mockReturnValue(<div>hey</div>);
    const callback = () => {};
    const { rerender } = render(
      <WithCallback inputs={[1, 2]} callback={callback}>
        {mock}
      </WithCallback>,
    );

    // initial call
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(callback);
    const first: unknown = mock.mock.calls[0][0];
    expect(first).toBe(callback);

    mock.mockClear();
    // no input change
    // changing the reference to the callback function (will happen on each render)
    rerender(
      <WithCallback inputs={[1, 2]} callback={() => ({ hello: 'world' })}>
        {mock}
      </WithCallback>,
    );

    expect(mock).toHaveBeenCalledTimes(1);
    const second: unknown = mock.mock.calls[0][0];
    // same reference
    expect(second).toBe(first);

    mock.mockClear();

    // input change
    // changing the reference to the callback function (will happen on each render)
    const newCallback = () => {};
    rerender(
      <WithCallback inputs={[1, 2, 3]} callback={newCallback}>
        {mock}
      </WithCallback>,
    );

    expect(mock).toHaveBeenCalledTimes(1);
    const third: unknown = mock.mock.calls[0][0];
    // same reference
    expect(third).toBe(newCallback);
  });
});

describe('useMemo', () => {
  interface WithUseMemoProps {
    inputs?: unknown[];
    children: (value: unknown) => ReactNode;
    getResult: () => unknown;
  }

  function WithUseMemo(props: WithUseMemoProps) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = useMemo(props.getResult, props.inputs);

    return props.children(value);
  }

  it('should not break the cache on multiple calls', () => {
    const mock = jest.fn().mockReturnValue(<div>hey</div>);
    const { rerender } = render(
      <WithUseMemo inputs={[1, 2]} getResult={() => ({ hello: 'world' })}>
        {mock}
      </WithUseMemo>,
    );

    // initial call
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith({ hello: 'world' });
    const initial: unknown = mock.mock.calls[0][0];
    expect(initial).toEqual({ hello: 'world' });
    mock.mockClear();

    rerender(
      <WithUseMemo inputs={[1, 2]} getResult={() => ({ hello: 'world' })}>
        {mock}
      </WithUseMemo>,
    );

    expect(mock).toHaveBeenCalledWith(initial);
    const second: unknown = mock.mock.calls[0][0];
    // same reference
    expect(initial).toBe(second);
  });

  it('should break the cache when the inputs change', () => {
    const mock = jest.fn().mockReturnValue(<div>hey</div>);
    const { rerender } = render(
      <WithUseMemo inputs={[1, 2]} getResult={() => ({ hello: 'world' })}>
        {mock}
      </WithUseMemo>,
    );

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith({ hello: 'world' });
    const initial: unknown = mock.mock.calls[0][0];
    expect(initial).toEqual({ hello: 'world' });
    mock.mockClear();

    // inputs are different
    rerender(
      <WithUseMemo inputs={[1, 2, 3]} getResult={() => ({ hello: 'world' })}>
        {mock}
      </WithUseMemo>,
    );

    expect(mock).toHaveBeenCalledWith(initial);
    expect(mock).toHaveBeenCalledTimes(1);
    const second: unknown = mock.mock.calls[0][0];
    // different reference
    expect(initial).not.toBe(second);
  });

  it('should use the latest get result function when the cache breaks', () => {
    const mock = jest.fn().mockReturnValue(<div>hey</div>);
    const { rerender } = render(
      <WithUseMemo inputs={[1, 2]} getResult={() => ({ hello: 'world' })}>
        {mock}
      </WithUseMemo>,
    );

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith({ hello: 'world' });
    const initial: unknown = mock.mock.calls[0][0];
    expect(initial).toEqual({ hello: 'world' });
    mock.mockClear();

    // inputs are different
    rerender(
      <WithUseMemo
        inputs={[1, 2, 3]}
        getResult={() => ({ different: 'value' })}
      >
        {mock}
      </WithUseMemo>,
    );

    expect(mock).toHaveBeenCalledWith({ different: 'value' });
    expect(mock).toHaveBeenCalledTimes(1);
  });

  describe('no inputs', () => {
    it('should not memoize with no inputs', () => {
      const mock = jest.fn().mockReturnValue(<div>hey</div>);
      const { rerender } = render(
        <WithUseMemo getResult={() => ({ hello: 'world' })}>
          {mock}
        </WithUseMemo>,
      );

      // initial call
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith({ hello: 'world' });
      const initial: unknown = mock.mock.calls[0][0];
      expect(initial).toEqual({ hello: 'world' });
      mock.mockClear();

      // new function but still no inputs
      rerender(
        <WithUseMemo getResult={() => ({ hello: 'there' })}>
          {mock}
        </WithUseMemo>,
      );

      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith({ hello: 'there' });
    });

    it('should start memoizing if inputs are provided', () => {
      const mock = jest.fn().mockReturnValue(<div>hey</div>);
      const { rerender } = render(
        <WithUseMemo getResult={() => ({ hello: 'world' })}>
          {mock}
        </WithUseMemo>,
      );

      // initial call
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith({ hello: 'world' });
      const initial: unknown = mock.mock.calls[0][0];
      expect(initial).toEqual({ hello: 'world' });
      mock.mockClear();

      // new function but still no inputs
      // no memoization as previously there where no inputs
      rerender(
        <WithUseMemo getResult={() => ({ hello: 'there' })} inputs={[1, 2]}>
          {mock}
        </WithUseMemo>,
      );

      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith({ hello: 'there' });
      const second = mock.mock.calls[0][0];
      expect(second).toEqual({ hello: 'there' });
      mock.mockClear();

      // memoization as inputs have not changed
      rerender(
        <WithUseMemo getResult={() => ({ hello: 'there' })} inputs={[1, 2]}>
          {mock}
        </WithUseMemo>,
      );

      expect(mock).toHaveBeenCalledTimes(1);
      const third = mock.mock.calls[0][0];
      // reference unchanged
      expect(third).toBe(second);
      mock.mockClear();

      // memoization will be lost as inputs are gone
      rerender(
        <WithUseMemo getResult={() => ({ hello: 'there' })} inputs={undefined}>
          {mock}
        </WithUseMemo>,
      );

      expect(mock).toHaveBeenCalledTimes(1);
      const fourth = mock.mock.calls[0][0];
      expect(fourth).toEqual({ hello: 'there' });
      // reference changed
      expect(fourth).not.toBe(third);
    });

    it('should only call get result once on first pass', () => {
      const getResult = jest.fn().mockReturnValue({ hello: 'friend' });
      render(
        <WithUseMemo getResult={getResult} inputs={undefined}>
          {() => null}
        </WithUseMemo>,
      );

      // initial call
      expect(getResult).toHaveBeenCalledTimes(1);
    });
  });
});
