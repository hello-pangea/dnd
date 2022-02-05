import type { Position } from 'css-box-model';
import type { DroppableId } from '../../../../../../src/types';

export default () => {
  const scrollWindow = jest.fn<void, [Position]>();
  const scrollDroppable = jest.fn<void, [DroppableId, Position]>();

  return {
    scrollWindow,
    scrollDroppable,
  };
};
