import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';

const root = document.getElementById('root');

let nonce: string | undefined;

const cspEl = document.getElementById('csp-nonce');
if (cspEl) {
  nonce = cspEl.getAttribute('content') || undefined;
}

if (root) {
  hydrate(<App nonce={nonce} />, root);
}
