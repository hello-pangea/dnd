import React from 'react';
import { storiesOf } from '@storybook/react';

import Simple from '../src/simple/simple';
import SimpleWithScroll from '../src/simple/simple-scrollable';
import WithMixedSpacing from '../src/simple/simple-mixed-spacing';
import {
  inShadowRoot,
  inNestedShadowRoot,
  ShadowRootContext
} from '../src/shadow-root/inside-shadow-root';
import SimpleWithShadowRoot from '../src/shadow-root/simple-with-shadow-root';
import InteractiveElementsApp from '../src/interactive-elements/interactive-elements-app';

storiesOf('Examples/Shadow Root', module)
  .add('Super Simple - vertical list', () => inShadowRoot(
    <ShadowRootContext.Consumer>
      {(stylesRoot) => (<Simple stylesRoot={stylesRoot}/>)}
    </ShadowRootContext.Consumer>))
  .add('Super Simple - vertical list (nested shadow root)', () => inNestedShadowRoot(
    <ShadowRootContext.Consumer>
      {(stylesRoot) => (<Simple stylesRoot={stylesRoot}/>)}
    </ShadowRootContext.Consumer>)
  )
  .add('Super Simple - vertical list with scroll (overflow: auto)', () => inShadowRoot(
    <ShadowRootContext.Consumer>
      {(stylesRoot) => (<SimpleWithScroll overflow="auto" stylesRoot={stylesRoot}/>)}
    </ShadowRootContext.Consumer>)
  )
  .add('Super Simple - vertical list with scroll (overflow: scroll)', () => inShadowRoot(
    <ShadowRootContext.Consumer>
      {(stylesRoot) => (<SimpleWithScroll overflow="scroll" stylesRoot={stylesRoot}/>)}
    </ShadowRootContext.Consumer>)
  )
  .add('Super Simple - with mixed spacing', () => inShadowRoot(
    <ShadowRootContext.Consumer>
      {(stylesRoot) => (<WithMixedSpacing stylesRoot={stylesRoot}/>)}
    </ShadowRootContext.Consumer>)
  )
  .add('nested interactive elements - stress test (without styles)', () => inShadowRoot(
    <ShadowRootContext.Consumer>
      {(stylesRoot) => (<InteractiveElementsApp stylesRoot={stylesRoot}/>)}
    </ShadowRootContext.Consumer>)
  )
  .add(
    'Super Simple - vertical list (with draggables containing shadowRoots)', () => 
    <ShadowRootContext.Consumer>
      {(stylesRoot) => (<SimpleWithShadowRoot stylesRoot={stylesRoot} />)}
    </ShadowRootContext.Consumer>
  );