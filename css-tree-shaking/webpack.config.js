const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
  mode: 'production',
  devtool: false,
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
                // esModule: false
              modules: {
                localIdentName: "[local]--[hash:base64:20]",
              },
            }
          }
        ]
      }
    ]
  },
  plugins: [new MiniCSSExtractPlugin({})]
};