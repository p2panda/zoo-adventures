// SPDX-License-Identifier: MIT

const path = require('path');

const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const getPath = (file) => {
  return path.resolve(__dirname, 'src', file);
};

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  const filename = isDevelopment ? '[name]' : '[name]-[contenthash:6]';

  return {
    entry: {
      app: getPath('index.tsx'),
    },
    output: {
      filename: `${filename}.js`,
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
      extensions: ['.js', '.ts', '.tsx', '.wasm'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'ts-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.wasm$/,
          type: 'asset/resource'
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: getPath('index.html'),
      }),
      new ESLintPlugin({
        extensions: ['.ts', '.tsx'],
      }),
      new CopyPlugin({
        patterns: [
          { from: 'node_modules/p2panda-js/lib/*.wasm', to: '[name][ext]'},
        ],
      }),
    ],
    devtool: 'source-map',
    devServer: {
      historyApiFallback: true,
      // This has to be the same value as in `tauri.conf.json` to enable
      // development within the native tauri webview container.
      port: 4000,
      clientLogLevel: 'error',
    },
  };
};
