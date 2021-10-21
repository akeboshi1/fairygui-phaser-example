const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require('path')
const config = {
  entry: path.join(__dirname, '/src/main.ts'), // 入口文件
  output: {
    path: path.join(__dirname, '/dist'), //打包后的文件存放的地方
    filename: 'main.js' //打包后输出文件的文件名
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader", options: { allowTsInNodeModules: false }, exclude: "/node_modules/" },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "head",
      title: "Phaser example",
      template: path.join(__dirname, "./index.html"),
      chunks: ["tooqing"]
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "assets", to: "assets", toType: "dir" }
      ]
    }),
    new webpack.DefinePlugin({
      WEBGL_RENDERER: true, // I did this to make webpack work, but I"m not really sure it should always be true
      CANVAS_RENDERER: true, // I did this to make webpack work, but I"m not really sure it should always be true
    }),
    new CleanWebpackPlugin()
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: false,
    allowedHosts: "auto",
    port: 8088,
    devMiddleware: {
      writeToDisk: true,
    }
  }
};
module.exports = (env, argv) => {
  return config;
};
