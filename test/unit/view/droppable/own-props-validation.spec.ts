/* eslint-disable @typescript-eslint/ban-ts-comment */
import mount from './util/mount';
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
    // @ts-ignore: expect error - not provided
    ownProps.droppableId = undefined;
    mount({ ownProps });
  });

  withError(() => {
    // @ts-ignore: expect error - not a string
    ownProps.droppableId = null;
    mount({ ownProps });
  });

  withError(() => {
    // @ts-ignore: expect error - using number
    ownProps.droppableId = 3;
    mount({ ownProps });
  });
});

it('should throw if isDropDisabled is set to null', () => {
  const ownProps = {
    ...defaultOwnProps,
  };
  withError(() => {
    // @ts-ignore: expect error - null
    ownProps.isDropDisabled = null;
    mount({ ownProps });
  });
});

it('should throw if isCombineEnabled is set to null', () => {
  const ownProps = {
    ...defaultOwnProps,
  };
  withError(() => {
    // @ts-ignore: expect error - null
    ownProps.isCombineEnabled = null;
    mount({ ownProps });
  });
});

it('should throw if ignoreContainerClipping is set to null', () => {
  const ownProps = {
    ...defaultOwnProps,
  };
  withError(() => {
    // @ts-ignore: expect error - null
    ownProps.ignoreContainerClipping = null;
    mount({ ownProps });
  });
});
