/* eslint-disable flowtype/require-valid-file-annotation */

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
import fs from 'fs';
import path from 'path';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import pkg from './package.json';

const input = './src/index.js';
const extensions = ['.js', '.jsx'];

// Treat as externals all not relative and not absolute paths
// e.g. 'react'
const excludeAllExternals = (id) => !id.startsWith('.') && !id.startsWith('/');

const getBabelOptions = ({ useESModules }) => ({
  exclude: 'node_modules/**',
  babelHelpers: 'runtime',
  plugins: [['@babel/plugin-transform-runtime', { useESModules }]],
});

const snapshotArgs =
  process.env.SNAPSHOT === 'match'
    ? {
        matchSnapshot: true,
        threshold: 1000,
      }
    : {};

const commonjsArgs = {
  include: 'node_modules/**',
};

// Simple copy plugin
// https://dev.to/lukap/creating-a-rollup-plugin-to-copy-and-watch-a-file-3hi2
const copyTypesciptDeclarationFile = () => ({
  name: 'copy-typescript-declaration-file',
  async buildStart() {
    this.addWatchFile(path.resolve('src/index.d.ts'));
  },
  async generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'dnd.d.ts',
      source: fs.readFileSync('src/index.d.ts'),
    });
  },
});

export default [
  // Universal module definition (UMD) build
  // - including console.* statements
  // - conditionally used to match snapshot size
  {
    input,
    output: {
      file: 'dist/dnd.js',
      format: 'umd',
      name: 'ReactBeautifulDnd',
      globals: { react: 'React', 'react-dom': 'ReactDOM' },
    },
    // Only deep dependency required is React
    external: ['react', 'react-dom'],
    plugins: [
      json(),
      babel(getBabelOptions({ useESModules: true })),
      resolve({ extensions }),
      commonjs(commonjsArgs),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      copyTypesciptDeclarationFile(),
      sizeSnapshot(snapshotArgs),
    ],
  },

  // Minified UMD build
  {
    input,
    output: {
      file: 'dist/dnd.min.js',
      format: 'umd',
      name: 'ReactBeautifulDnd',
      globals: { react: 'React', 'react-dom': 'ReactDOM' },
    },
    // Only deep dependency required is React
    external: ['react', 'react-dom'],
    plugins: [
      json(),
      babel(getBabelOptions({ useESModules: true })),
      resolve({ extensions }),
      commonjs(commonjsArgs),
      strip(),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      sizeSnapshot(snapshotArgs),
      terser(),
      // Useful for debugging: you can see what code is dropped
      // terser({
      //   mangle: false,
      //   compress: false,
      //   keep_fnames: true,
      //   output: { beautify: true },
      // }),
    ],
  },

  // CommonJS (cjs) build
  // - Keeping console.log statements
  // - All external packages are not bundled
  {
    input,
    output: { file: pkg.main, format: 'cjs' },
    external: excludeAllExternals,
    plugins: [
      json(),
      resolve({ extensions }),
      babel(getBabelOptions({ useESModules: false })),
    ],
  },

  // EcmaScript Module (esm) build
  // - Keeping console.log statements
  // - All external packages are not bundled
  {
    input,
    output: { file: pkg.module, format: 'esm' },
    external: excludeAllExternals,
    plugins: [
      json(),
      resolve({ extensions }),
      babel(getBabelOptions({ useESModules: true })),
      sizeSnapshot(snapshotArgs),
    ],
  },
];
