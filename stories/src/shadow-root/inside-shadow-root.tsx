import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

// TODO...
// import retargetEvents from 'react-shadow-dom-retarget-events';

export const ShadowRootContext = React.createContext<HTMLElement|null>(null);

class MyCustomElement extends HTMLElement {
  content: ReactNode;
  root: ShadowRoot;
  appContainer: HTMLElement;

  mountComponent() {
    if (!this.appContainer) {
      this.root = this.attachShadow({ mode: 'open' });
      this.appContainer = document.createElement('div');
      this.root.appendChild(this.appContainer);
    }

    if (this.content) {
      ReactDOM.render(
        <ShadowRootContext.Provider value={this.appContainer}>
          {this.content}
        </ShadowRootContext.Provider>,
        this.appContainer,
      );

      // needed for React versions before 17
      // TODO...
      // retargetEvents(this.root);
    }
  }

  unmountComponent() {
    if (this.appContainer) {
      ReactDOM.unmountComponentAtNode(this.appContainer);
    }
  }

  setContent(content: ReactNode) {
    this.content = content;
    this.updateComponent();
  }

  updateComponent() {
    this.unmountComponent();
    this.mountComponent();
  }

  connectedCallback() {
    this.mountComponent();
  }

  disconnectedCallback() {
    this.unmountComponent();
  }
}

customElements.define('my-custom-element', MyCustomElement);

class CompoundCustomElement extends HTMLElement {
  childComponent: MyCustomElement;
  root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.childComponent = document.createElement('my-custom-element') as MyCustomElement;
    this.root.appendChild(this.childComponent);
  }
}

customElements.define('compound-custom-element', CompoundCustomElement);

declare global {
  module JSX {
    interface IntrinsicElements {
      // TODO... any
      "my-custom-element": any,
      "compound-custom-element": any
    }
  }
}

export function inShadowRoot(child: ReactNode) {
  return (
    <my-custom-element
      ref={(node: MyCustomElement | null) => {
        if (node) {
          node.setContent(child);
        }
      }}
    />
  );
}

export function inNestedShadowRoot(child: ReactNode) {
  return (
    <compound-custom-element
      ref={(node: CompoundCustomElement | null) => {
        if (node) {
          node.childComponent.setContent(child);
        }
      }}
    />
  );
}