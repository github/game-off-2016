'use strict';

const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  context: __dirname + "/src",
  entry: {
    app: "./main.ts"
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
      {from: '../node_modules/stats.js/build/stats.min.js'},
      {from: './assets', to: './assets'},
      {from: './css', to: './css'}
    ])
  ]
};
