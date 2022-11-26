/**
 * @jest-environment node
 */
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { invariant } from '../../../../src/invariant';
import { resetServerContext } from '../../../../src';
import App from '../util/app';
import invokeOnReactVersion from '../../../util/invoke-on-react-version';

let consoleWarnSpy: jest.SpiedFunction<typeof console.warn>;
let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;
let consoleLogSpy: jest.SpiedFunction<typeof console.log>;

beforeEach(() => {
  // Reset server context between tests to prevent state being shared between them
  invokeOnReactVersion(['16', '17'], resetServerContext);

  consoleWarnSpy = jest.spyOn(console, 'warn');
  consoleErrorSpy = jest.spyOn(console, 'error');
  consoleLogSpy = jest.spyOn(console, 'log');
});

afterEach(() => {
  consoleWarnSpy.mockRestore();
  consoleErrorSpy.mockRestore();
  consoleLogSpy.mockRestore();
});

const expectConsoleNotCalled = () => {
  expect(consoleWarnSpy).not.toHaveBeenCalled();
  expect(consoleErrorSpy).not.toHaveBeenCalled();
  expect(consoleLogSpy).not.toHaveBeenCalled();
};

// Checking that the browser globals are not available in this test file
invariant(
  typeof window === 'undefined' && typeof document === 'undefined',
  'browser globals found in node test',
);

it('should support rendering to a string', () => {
  const result: string = renderToString(<App />);

  expect(result).toEqual(expect.any(String));
  expect(result).toMatchSnapshot();
  expectConsoleNotCalled();
});

it('should support rendering to static markup', () => {
  const result: string = renderToStaticMarkup(<App />);

  expect(result).toEqual(expect.any(String));
  expect(result).toMatchSnapshot();
  expectConsoleNotCalled();
});

// This test is unsuited for React 18+, which with useId can
// produce simultaneously unique and deterministic IDs
invokeOnReactVersion(['16', '17'], () => {
  it('should render identical content when resetting context between renders', () => {
    const firstRender = renderToString(<App />);
    const nextRenderBeforeReset = renderToString(<App />);
    expect(firstRender).not.toEqual(nextRenderBeforeReset);

    resetServerContext();
    const nextRenderAfterReset = renderToString(<App />);
    expect(firstRender).toEqual(nextRenderAfterReset);
    expectConsoleNotCalled();
  });
});
