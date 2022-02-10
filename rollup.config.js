import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import dts from 'rollup-plugin-dts';

import pkg from './package.json';

const input = './src/index.ts';
const extensions = ['.ts', '.tsx'];

// Treat as externals all not relative and not absolute paths
// e.g. 'react'
const excludeAllExternals = (id) => !id.startsWith('.') && !id.startsWith('/');

const getBabelOptions = ({ useESModules }) => ({
  extensions,
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

  // TypeScript declaration
  {
    input,
    output: [{ file: 'dist/dnd.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
