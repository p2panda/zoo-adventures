const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      extensions: ['.js', '.ts', '.tsx'],
    },
    experiments: {
      // Support the new WebAssembly according to the updated specification, it
      // makes a WebAssembly module an async module.
      // See: https://webpack.js.org/configuration/experiments/
      asyncWebAssembly: true,
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
              loader: 'eslint-loader',
            },
            {
              loader: 'ts-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: getPath('index.html'),
      }),
    ],
    devtool: 'source-map',
    devServer: {
      historyApiFallback: true,
      // Fixes confusing console log `webpack output is served from undefined`.
      // See: https://github.com/webpack/webpack-dev-server/issues/2745
      publicPath: '/',
      // This has to be the same value as in `tauri.conf.json` to enable
      // development within the native tauri webview container.
      port: 4000,
    },
  };
};
