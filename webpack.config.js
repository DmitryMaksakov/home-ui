const
  path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  env = process.env.NODE_ENV ? process.env.NODE_ENV : process.argv.indexOf('-p') !== -1 ? 'production' : 'development',
  PORT = env === 'development' ? 8000 : 80,
  outputPath = path.resolve(__dirname, './production');

console.log(env);

const config = {
  entry: [
    'normalize.css/normalize.css',
    'bootstrap/dist/css/bootstrap.css',
    'babel-polyfill',
    './src/index',
    './src/styles/common.styl'
  ],

  cache: true,

  devtool: 'source-map',

  output: {
    path: outputPath,
    filename: '[name].[chunkhash].js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: 'css-loader'
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'stylus-loader']
        })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: 'file-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: 'file-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
    new ExtractTextPlugin("styles.[chunkhash].css"),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      PORT: PORT
    }),

    new CopyWebpackPlugin([
      { from: 'src/icons', to: path.resolve(outputPath, 'icons') },
      { from: 'src/images', to: path.resolve(outputPath, 'images') }
    ])
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },

  devServer: {
    port: PORT,
    noInfo: false,
    historyApiFallback: true
  }
};

module.exports = config;
