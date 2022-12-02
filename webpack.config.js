const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require('path');
var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var Phaser = path.join(phaserModule, 'src/phaser.js')
const config = {
  entry: {
    appo: path.join(__dirname, '/src/main.js'), // 入口文件,
    vendor: ['phaser', 'three', '@babel/polyfill'],
  },
  output: {
    path: path.join(__dirname, '/dist'), //打包后的文件存放的地方
    library: '[name]',
    libraryTarget: 'umd',
    filename: '[name].js' //打包后输出文件的文件名
  },
  module: {
    rules: [
      // { test: /\.ts$/, loader: "ts-loader", options: { allowTsInNodeModules: false }, exclude: "/node_modules/" },
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
    ],
  },
  resolve: {
    alias: {
      phaser: Phaser
    },
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
    new webpack.ProvidePlugin({ THREE: 'three' }),
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
