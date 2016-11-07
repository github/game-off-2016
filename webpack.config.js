'use strict';

const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  context: __dirname + "/src",
  entry: {
    app: "./game/main.ts"
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: "ts-loader"
        }]
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['assets', 'css'], {}),
    new HtmlWebpackPlugin ({
      inject: true,
      template: './index.html'
    }),
    new CopyWebpackPlugin([
      {from: '../node_modules/pixi.js/bin/pixi.min.js'},
      {from: '../node_modules/pixi.js/bin/pixi.min.js.map'},
      {from: './assets', to: './assets'},
      {from: './css', to: './css'}
    ])
  ]
};
