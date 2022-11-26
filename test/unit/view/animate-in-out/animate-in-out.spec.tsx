import React from 'react';
import { render } from '@testing-library/react';
import AnimateInOut from '../../../../src/view/animate-in-out/animate-in-out';

import type { AnimateProvided } from '../../../../src/view/animate-in-out/animate-in-out';

it('should allow children not to be rendered (no animation allowed)', () => {
  const child = jest.fn().mockReturnValue(<div>hi</div>);

  const { container } = render(
    <AnimateInOut on={null} shouldAnimate={false}>
      {child}
    </AnimateInOut>,
  );

  expect(container.innerHTML).toBe('');
  expect(child).not.toHaveBeenCalled();
});

it('should allow children not to be rendered (even when animation is allowed)', () => {
  const child = jest.fn().mockReturnValue(<div>hi</div>);

  const { container } = render(
    <AnimateInOut on={null} shouldAnimate>
      {child}
    </AnimateInOut>,
  );

  expect(container.innerHTML).toBe('');
  expect(child).not.toHaveBeenCalled();
});

it('should pass data through to children', () => {
  const child = jest.fn().mockReturnValue(<div>hi</div>);
  const data = { hello: 'world' };

  render(
    <AnimateInOut on={data} shouldAnimate={false}>
      {child}
    </AnimateInOut>,
  );

  const expected: AnimateProvided = {
    data,
    animate: 'none',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - wrong type
    onClose: expect.any(Function),
  };
  expect(child).toHaveBeenCalledWith(expected);
});

it('should open instantly if required', () => {
  const child = jest.fn().mockReturnValue(<div>hi</div>);
  const data = { hello: 'world' };

  render(
    <AnimateInOut on={data} shouldAnimate={false}>
      {child}
    </AnimateInOut>,
  );

  const expected: AnimateProvided = {
    data,
    animate: 'none',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - wrong type
    onClose: expect.any(Function),
  };
  expect(child).toHaveBeenCalledWith(expected);
});

it('should animate open if requested', () => {
  const child = jest.fn().mockReturnValue(<div>hi</div>);
  const data = { hello: 'world' };

  render(
    <AnimateInOut on={data} shouldAnimate>
      {child}
    </AnimateInOut>,
  );

  const expected: AnimateProvided = {
    data,
    animate: 'open',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - wrong type
    onClose: expect.any(Function),
  };
  expect(child).toHaveBeenCalledWith(expected);
});

it('should close instantly if required', () => {
  const child = jest.fn().mockReturnValue(<div>hi</div>);
  const data = { hello: 'world' };
  function App({ value }: { value: unknown }) {
    return (
      <AnimateInOut on={value} shouldAnimate={false}>
        {child}
      </AnimateInOut>
    );
  }

  const { rerender, container } = render(<App value={data} />);

  const initial: AnimateProvided = {
    data,
    animate: 'none',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - wrong type
    onClose: expect.any(Function),
  };
  expect(child).toHaveBeenCalledWith(initial);
  expect(container.innerHTML).toEqual('<div>hi</div>');
  child.mockClear();

  // start closing
  // data is gone! this should trigger a close
  rerender(<App value={null} />);
  expect(container.innerHTML).toEqual('');
  expect(child).not.toHaveBeenCalled();
});

it('should animate closed if required', () => {
  const child = jest.fn().mockReturnValue(<div>hi</div>);
  const data = { hello: 'world' };

  interface Props {
    value: unknown;
    shouldAnimate: boolean;
  }

  function App({ value, shouldAnimate }: Props) {
    return (
      <AnimateInOut on={value} shouldAnimate={shouldAnimate}>
        {child}
      </AnimateInOut>
    );
  }

  const { container, rerender } = render(
    <App value={data} shouldAnimate={false} />,
  );

  const initial: AnimateProvided = {
    data,
    animate: 'none',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - wrong type
    onClose: expect.any(Function),
  };
  expect(child).toHaveBeenCalledWith(initial);
  expect(child).toHaveBeenCalledTimes(1);
  expect(container.innerHTML).toEqual('<div>hi</div>');
  child.mockClear();

  // start closing
  // data is gone! this should trigger a close
  rerender(<App value={null} shouldAnimate />);

  const second: AnimateProvided = {
    // data is still provided to child for final render
    data,
    // still visible while animating
    animate: 'close',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - wrong type
    onClose: expect.any(Function),
  };
  expect(child).toHaveBeenCalledWith(second);

  // telling AnimateInOut that the animation is finished
  const provided: AnimateProvided = child.mock.calls[0][0];
  child.mockClear();
  // this will trigger a setState that will stop rendering the child
  provided.onClose();

  rerender(<App value={null} shouldAnimate />);

  expect(container.innerHTML).toEqual('');
  expect(child).not.toHaveBeenCalled();
});
