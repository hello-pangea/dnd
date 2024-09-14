/**
 * @jest-environment node
 */
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { invariant } from '../../../../src/invariant';
import App from '../util/app';

let consoleWarnSpy: jest.SpiedFunction<typeof console.warn>;
let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;
let consoleLogSpy: jest.SpiedFunction<typeof console.log>;

beforeEach(() => {
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
