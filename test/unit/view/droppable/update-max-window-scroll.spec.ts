import type { ReactWrapper } from 'enzyme';
import mount from './util/mount';
import { homeOwnProps, isOverHome, isNotOverHome } from './util/get-props';
import type { DispatchProps } from '../../../../src/view/droppable/droppable-types';
import getMaxWindowScroll from '../../../../src/view/window/get-max-window-scroll';
import Placeholder from '../../../../src/view/placeholder';

it('should update when a placeholder animation finishes', () => {
  const dispatchProps: DispatchProps = {
    updateViewportMaxScroll: jest.fn(),
  };
  const wrapper: ReactWrapper<any> = mount({
    ownProps: homeOwnProps,
    mapProps: isOverHome,
    dispatchProps,
    isMovementAllowed: () => true,
  });

  wrapper.find(Placeholder).props().onTransitionEnd();

  expect(dispatchProps.updateViewportMaxScroll).toHaveBeenCalledWith({
    maxScroll: getMaxWindowScroll(),
  });
});

it('should update when a placeholder finishes and the list is not dragged over', () => {
  const dispatchProps: DispatchProps = {
    updateViewportMaxScroll: jest.fn(),
  };
  const wrapper: ReactWrapper<any> = mount({
    ownProps: homeOwnProps,
    mapProps: isNotOverHome,
    dispatchProps,
    isMovementAllowed: () => true,
  });

  wrapper.find(Placeholder).props().onTransitionEnd();

  expect(dispatchProps.updateViewportMaxScroll).toHaveBeenCalledWith({
    maxScroll: getMaxWindowScroll(),
  });
});

it('should not update when dropping', () => {
  const dispatchProps: DispatchProps = {
    updateViewportMaxScroll: jest.fn(),
  };
  const wrapper: ReactWrapper<any> = mount({
    ownProps: homeOwnProps,
    mapProps: isNotOverHome,
    dispatchProps,
    // when dropping there is no movement allowed
    isMovementAllowed: () => false,
  });

  wrapper.find(Placeholder).props().onTransitionEnd();

  expect(dispatchProps.updateViewportMaxScroll).not.toHaveBeenCalled();
});
