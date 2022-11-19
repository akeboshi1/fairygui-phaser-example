const webpack = require("webpack");
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'development',
  // devtool: 'inline-source-map',
  entry: path.join(__dirname, '/raycaster/index.js'), // 入口文件
  output: {
    path: path.join(__dirname, '/dist'), //打包后的文件存放的地方
    filename: 'raycaster.js', //打包后输出文件的文件名
    library: "[name]",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      }
    ]
  },
  // performance: {
  //   maxEntrypointSize: 900000,
  //   maxAssetSize: 900000,
  // },
  // optimization: {
  //   minimizer: [
  //     new TerserPlugin({
  //       terserOptions: {
  //         output: {
  //           comments: false,
  //         },
  //       },
  //     }),
  //   ],
  // },
};

