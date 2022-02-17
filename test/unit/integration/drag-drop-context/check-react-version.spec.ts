import React from 'react';
import checkReactVersion from '../../../../src/view/drag-drop-context/check-react-version';
import { peerDependencies } from '../../../../package.json';

let consoleWarnSpy: jest.SpyInstance;

beforeEach(() => {
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  consoleWarnSpy.mockRestore();
});

it('should pass if the react peer dep version is met', () => {
  const version = '1.3.4';

  checkReactVersion(version, version);

  expect(consoleWarnSpy).not.toHaveBeenCalled();
});

it('should pass if the react peer dep version is passed', () => {
  // patch
  {
    const peerDep = '1.3.4';
    const actual = '1.3.5';

    checkReactVersion(peerDep, actual);

    expect(consoleWarnSpy).not.toHaveBeenCalled();
  }
  // minor
  {
    const peerDep = '1.3.4';
    const actual = '1.4.0';

    checkReactVersion(peerDep, actual);

    expect(consoleWarnSpy).not.toHaveBeenCalled();
  }
  // major
  {
    const peerDep = '1.3.4';
    const actual = '2.0.0';

    checkReactVersion(peerDep, actual);

    expect(consoleWarnSpy).not.toHaveBeenCalled();
  }
});

it('should fail if the react peer dep version is not met', () => {
  // patch not met
  {
    const peerDep = '1.3.4';
    const actual = '1.3.3';

    checkReactVersion(peerDep, actual);

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    consoleWarnSpy.mockClear();
  }
  // minor not met
  {
    const peerDep = '1.3.4';
    const actual = '1.2.4';

    checkReactVersion(peerDep, actual);

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    consoleWarnSpy.mockClear();
  }
  // major not met
  {
    const peerDep = '1.3.4';
    const actual = '0.3.4';

    checkReactVersion(peerDep, actual);

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    consoleWarnSpy.mockClear();
  }
});

it('should throw if unable to parse the react version', () => {
  const peerDep = '1.3.4';
  const actual = '1.x';

  expect(() => checkReactVersion(peerDep, actual)).toThrow();
});

it('should throw if unable to parse the peer dep version', () => {
  const peerDep = '1.x';
  const actual = '1.2.3';

  expect(() => checkReactVersion(peerDep, actual)).toThrow();
});

it('should allow pre release provided versions', () => {
  const peerDep = '1.0.0';
  const alpha = '1.2.3-alpha';
  const beta = '1.2.3-beta';

  checkReactVersion(peerDep, alpha);
  checkReactVersion(peerDep, beta);

  expect(consoleWarnSpy).not.toHaveBeenCalled();
});

// actually an integration test, but this feels like the right place for it
it('should pass on the current repo setup', () => {
  const peerDep: string = peerDependencies.react;
  const actual: string = React.version;

  checkReactVersion(peerDep, actual);

  expect(consoleWarnSpy).not.toHaveBeenCalled();
});
