const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const getPath = (file) => {
  return path.resolve(__dirname, 'src', file);
};

module.exports = () => {
  return {
    target: 'web',
    devtool: 'eval-source-map',
    entry: getPath('index.jsx'),
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'eslint-loader',
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
    devServer: {
      writeToDisk: true,
    },
  };
};
