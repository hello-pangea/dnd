import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './app';

const root = document.getElementById('root');

let nonce: string | undefined;

const cspEl = document.getElementById('csp-nonce');
if (cspEl) {
  nonce = cspEl.getAttribute('content') || undefined;
}

if (root) {
  hydrateRoot(root, <App nonce={nonce} />);
}
