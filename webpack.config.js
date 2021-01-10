const path = require('path');

const ESLintPlugin = require('eslint-webpack-plugin');
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
    ],
    devtool: 'source-map',
    devServer: {
      historyApiFallback: true,
      // This has to be the same value as in `tauri.conf.json` to enable
      // development within the native tauri webview container.
      port: 4000,
    },
  };
};
