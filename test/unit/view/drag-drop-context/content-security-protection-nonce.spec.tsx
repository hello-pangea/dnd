import { render } from '@testing-library/react';
import React from 'react';
import DragDropContext from '../../../../src/view/drag-drop-context';
import { resetServerContext } from '../../../../src';
import * as attributes from '../../../../src/view/data-attributes';
import getReactMajorVersion from '../../../util/get-react-major-version';
import invokeOnReactVersion from '../../../util/invoke-on-react-version';

const isReact18 = getReactMajorVersion() === '18';
it('should insert nonce into style tag', () => {
  const nonce = 'ThisShouldBeACryptographicallySecurePseudorandomNumber';

  invokeOnReactVersion(['16', '17'], resetServerContext);
  const { unmount } = render(
    <DragDropContext nonce={nonce} onDragEnd={() => {}}>
      {null}
    </DragDropContext>,
  );
  const styleTag = document.querySelector(
    `[${attributes.prefix}-always="${isReact18 ? ':r0:' : '0'}"]`,
  );
  const nonceAttribute = styleTag ? styleTag.getAttribute('nonce') : '';
  expect(nonceAttribute).toEqual(nonce);

  unmount();
});
