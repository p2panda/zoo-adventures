const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const getPath = (file) => {
  return path.resolve(__dirname, "src", file);
};

module.exports = () => {
  return {
    target: "web",
    devtool: "eval-source-map",
    entry: getPath("index.tsx"),
    resolve: {
      extensions: [".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
            },
            {
              loader: "eslint-loader",
            },
            {
              loader: "ts-loader",
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: getPath("index.html"),
      }),
    ],
    devServer: {
      writeToDisk: true,
    },
  };
};
