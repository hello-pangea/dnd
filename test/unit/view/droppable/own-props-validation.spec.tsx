/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render } from '@testing-library/react';
import React from 'react';
import App from './util/app';
import { homeOwnProps as defaultOwnProps } from './util/get-props';
import { withError } from '../../../util/console';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  if (jest.isMockFunction(console.error)) {
    // FIXME
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (console.error as any).mockReset();
  }
});

it('should throw if no droppableId is provided', () => {
  const ownProps = {
    ...defaultOwnProps,
  };

  withError(() => {
    // @ts-expect-error
    ownProps.droppableId = undefined;
    render(<App ownProps={ownProps} />);
  });

  withError(() => {
    // @ts-expect-error
    ownProps.droppableId = null;
    render(<App ownProps={ownProps} />);
  });

  withError(() => {
    // @ts-expect-error
    ownProps.droppableId = 3;
    render(<App ownProps={ownProps} />);
  });
});

it('should throw if isDropDisabled is set to null', () => {
  const ownProps = {
    ...defaultOwnProps,
  };
  withError(() => {
    // @ts-expect-error
    ownProps.isDropDisabled = null;
    render(<App ownProps={ownProps} />);
  });
});

it('should throw if isCombineEnabled is set to null', () => {
  const ownProps = {
    ...defaultOwnProps,
  };
  withError(() => {
    // @ts-expect-error
    ownProps.isCombineEnabled = null;
    render(<App ownProps={ownProps} />);
  });
});

it('should throw if ignoreContainerClipping is set to null', () => {
  const ownProps = {
    ...defaultOwnProps,
  };
  withError(() => {
    // @ts-expect-error
    ownProps.ignoreContainerClipping = null;
    render(<App ownProps={ownProps} />);
  });
});
