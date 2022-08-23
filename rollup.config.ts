import pluginCommonJS from '@rollup/plugin-commonjs';
import pluginDts from 'rollup-plugin-dts';
import pluginHtml from '@rollup/plugin-html';
import pluginReplace from '@rollup/plugin-replace';
import pluginTypeScript from '@rollup/plugin-typescript';
import { nodeResolve as pluginNodeResolve } from '@rollup/plugin-node-resolve';
import { terser as pluginTerser } from 'rollup-plugin-terser';

import type { RollupOptions, ModuleFormat } from 'rollup';

const SRC_DIR = 'src';
const DIST_DIR = 'lib';
const DIST_DEMO_DIR = 'demo-dist';
const PROJECT_NAME = 'zooAdventures';
const USE_SOURCEMAP = true;

// Build React component library
function config(format: ModuleFormat): RollupOptions[] {
  const input = `./${SRC_DIR}/index.tsx`;

  // Determine suffix of output files. For CommonJS builds we choose `.cjs`.
  const ext = format === 'cjs' ? 'cjs' : 'js';

  return [
    {
      input,
      external: ['react'],
      output: [
        {
          name: PROJECT_NAME,
          file: `${DIST_DIR}/${format}/index.${ext}`,
          format,
          sourcemap: USE_SOURCEMAP,
        },
        {
          name: PROJECT_NAME,
          file: `${DIST_DIR}/${format}/index.min.js`,
          format,
          sourcemap: USE_SOURCEMAP,
          plugins: [pluginTerser()],
        },
      ],
      plugins: [pluginTypeScript(), pluginNodeResolve()],
    },
    {
      input,
      output: {
        file: `${DIST_DIR}/${format}/index.d.ts`,
        format,
      },
      plugins: [pluginDts()],
    },
  ];
}

// Build demo website using the component. This can be used for testing and
// served as a static page
function demoConfig(): RollupOptions[] {
  const input = `./${SRC_DIR}/demo.tsx`;

  return [
    {
      input,
      output: {
        name: PROJECT_NAME,
        file: `${DIST_DEMO_DIR}/index.js`,
        format: 'iife',
        sourcemap: USE_SOURCEMAP,
      },
      plugins: [
        pluginReplace({
          preventAssignment: true,
          values: {
            'process.env.NODE_ENV': JSON.stringify('development'),
          },
        }),
        pluginTypeScript(),
        pluginHtml({
          title: PROJECT_NAME,
        }),
        pluginCommonJS(),
        pluginNodeResolve(),
      ],
    },
  ];
}

export default [...config('esm'), ...config('cjs'), ...demoConfig()];
