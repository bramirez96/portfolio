const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

module.exports = {
  /**
   * Here we declare and name our different Javascript chunks to control
   * what gets included in each page's bundle.
   */
  entry: {
    /** the vendor chunk is package deps */
    vendor: Object.keys(package.dependencies),
    /** these point to specific javascript files in views */
    home: './src/views/index.ts',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].[chunkhash:8].bundle.js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      { test: /\.svg$/, loader: 'url-loader' },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            sources: {
              list: [
                { tag: 'img', attribute: 'src', type: 'src' },
                { attribute: 'data-src', type: 'src' },
                { attribute: 'data-srcset', type: 'srcset' },
              ],
            },
            minimize: true,
          },
        },
      },
    ],
  },
  optimization: {
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
      chunks: 'all',
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new PurgecssPlugin({
      paths: glob.sync(path.resolve(__dirname, '../src/**/*'), { nodir: true }),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].bundle.css',
      chunkFilename: '[name].[chunkhash:8].chunk.css',
    }),
    /**
     * In the plugins, we specify different html pages that need to be exposed
     * as well ass all of the different named chunks that should be included in
     * that page's bundle.
     */
    new HtmlWebpackPlugin({
      template: './src/views/index.html',
      filename: 'index.html',
      chunks: ['vendor', 'home'], // This page includes package deps and the home ts file
    }),
    /**
     * These goe after our HTML plugins
     */
    new CompressionPlugin({
      algorithm: 'gzip',
    }),
    new BrotliPlugin(),
  ],
};
