const path = require('path');

console.log(__dirname, '__dirname__dirname')
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'demo.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};