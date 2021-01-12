import type { Position } from 'css-box-model';
import type { DraggableDimension, Viewport } from '../../../../src/types';
import { add } from '../../../../src/state/position';
import { getPreset } from '../../../util/dimension';
import scrollViewport from '../../../../src/state/scroll-viewport';
import getClientFromPageBorderBoxCenter from '../../../../src/state/get-center-from-impact/get-client-border-box-center/get-client-from-page-border-box-center';

const preset = getPreset();
const draggable: DraggableDimension = preset.inHome1;
const originalPageCenter: Position = preset.inHome1.page.borderBox.center;
const originalClientCenter: Position = preset.inHome1.client.borderBox.center;

it('should unwind window scroll changes', () => {
  const scroll: Position = { x: 10, y: 20 };
  const newScroll: Position = add(preset.windowScroll, scroll);
  const scrolled: Viewport = scrollViewport(preset.viewport, newScroll);
  const pageBorderBoxCenter: Position = add(originalPageCenter, scroll);

  const result: Position = getClientFromPageBorderBoxCenter({
    pageBorderBoxCenter,
    draggable,
    viewport: scrolled,
  });

  expect(result).toEqual(originalClientCenter);
});

it('should account for manual offsets', () => {
  const offset: Position = { x: 10, y: 25 };
  const pageBorderBoxCenter: Position = add(originalPageCenter, offset);

  const result: Position = getClientFromPageBorderBoxCenter({
    pageBorderBoxCenter,
    draggable,
    viewport: preset.viewport,
  });

  expect(result).toEqual(add(originalClientCenter, offset));
});
