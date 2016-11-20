'use strict';
var webpack = require('webpack');

module.exports = {
  context: __dirname + "/src",

  entry: [
    'babel-polyfill',
    './app'
  ],
  
  output: {
    path: __dirname + '/dist/',
    filename: 'app.js'
  },

  alias:{
    root: __dirname + '/./',
  },
  
  resolve: {
    extensions: ['', '.js', '.scss'],
  },
  
  module: {
    loaders: [
      { test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  node: {
    fs: "empty",
    __dirname: true,
    __filename: true
  },
  
};
