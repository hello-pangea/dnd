import type { CSSProperties } from 'react';
import type { ReactWrapper } from 'enzyme';
import type { PlaceholderStyle } from '../../../../../src/view/placeholder/placeholder-types';
import { placeholder } from './data';

export default (
  wrapper: ReactWrapper<unknown>,
): PlaceholderStyle | CSSProperties | null =>
  wrapper.find(placeholder.tagName).prop('style') || null;
