import { render } from '@testing-library/react';
import React from 'react';
import DragDropContext from '../../../../src/view/drag-drop-context';
import { resetServerContext } from '../../../../src';
import * as attributes from '../../../../src/view/data-attributes';
import getReactMajorVersion from '../../../util/get-react-major-version';

const pre18React = ['16', '17'].includes(getReactMajorVersion());
it('should insert nonce into style tag', () => {
  const nonce = 'ThisShouldBeACryptographicallySecurePseudorandomNumber';

  if (pre18React) resetServerContext();
  const { unmount } = render(
    <DragDropContext nonce={nonce} onDragEnd={() => {}}>
      {null}
    </DragDropContext>,
  );
  const styleTag = document.querySelector(
    `[${attributes.prefix}-always="${pre18React ? '0' : ':r0:'}"]`,
  );
  const nonceAttribute = styleTag ? styleTag.getAttribute('nonce') : '';
  expect(nonceAttribute).toEqual(nonce);

  unmount();
});
