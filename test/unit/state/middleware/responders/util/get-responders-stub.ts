import type { Responders } from '../../../../../../src/types';

export default function getRespondersStub() {
  return {
    onBeforeDragStart: jest.fn<Responders['onBeforeDragStart'], []>(),
    onDragStart: jest.fn<Responders['onDragStart'], []>(),
    onDragUpdate: jest.fn<Responders['onDragUpdate'], []>(),
    onDragEnd: jest.fn<Responders['onDragEnd'], []>(),
  };
}
