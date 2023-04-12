"use strict";

/**
 * Webpack Config
 */
const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = "/";

// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// plugins
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");
// the path(s) that should be cleaned
const cesiumSource = "node_modules/cesium/Source";
const cesiumWorkers = "../Build/Cesium/Workers";
const basePath = `${__dirname}/..`;

let pathsToClean = ["dist", "build"];

// the clean options to use
let cleanOptions = {
  root: __dirname,
  verbose: true, // Write logs to console.
  dry: false,
};

module.exports = {
  entry: ["babel-polyfill", "react-hot-loader/patch", "./src/index.js"],
  output: {
    // The build folder.
    path: resolveApp('dist'),
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: "static/js/[name].[hash:8].js",
    sourceMapFilename: "static/js/[name].[hash:8].map",
    chunkFilename: "static/js/[name].[hash:8].chunk.js",
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: publicPath,
    hotUpdateChunkFilename: "hot/hot-update.js",
    hotUpdateMainFilename: "hot/hot-update.json",
    sourcePrefix: "",
  },
  amd: {
    // Enable webpack-friendly use of require in Cesium
    toUrlUndefined: true,
  },
  devServer: {
    contentBase: './src/index.js',
    host: "0.0.0.0",
    compress: true,
    port: 3000, // port number
    disableHostCheck: true,   // gitpod host enable
    historyApiFallback: true,
    quiet: false,
    proxy: {
      '/api': {
        target: 'https://generatingreport-dcyfkp3xea-uc.a.run.app',
        secure: false
      },
    },
  },
  // resolve alias (Absolute paths)
  resolve: {
    alias: {
      Actions: path.resolve(__dirname, "src/actions/"),
      Components: path.resolve(__dirname, "src/components/"),
      Assets: path.resolve(__dirname, "src/assets/"),
      Util: path.resolve(__dirname, "src/util/"),
      Utils: path.resolve(__dirname, "src/utils/"),
      Routes: path.resolve(__dirname, "src/routes/"),
      Constants: path.resolve(__dirname, "src/constants/"),
      Helpers: path.resolve(__dirname, "src/helpers/"),
      Api: path.resolve(__dirname, "src/api/"),
      Firebase:path.resolve(__dirname, "src/firebase/"),
      // Cesium module name
      cesium$: "cesium/Cesium",
      cesium: "cesium/Source",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000",
      },
      // Scss compiler
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.sass$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: "[path][name]__[local]--[hash:base64:5]",
              camelCase: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.worker\.(js|ts)$/i,
        use: [{
          loader: 'comlink-loader',
          options: {
            singleton: true
          }
        }]
      }
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
      // Enable file caching
				cache: true,
				// Use multi-process parallel running to improve the build speed
				// Default number of concurrent runs: os.cpus().length - 1
				parallel: true,
				
				uglifyOptions: {
					compress: false,
					ecma: 8,
					mangle: true
				},
				sourceMap: true
      }),
    ],
  },
  performance: {
    hints: process.env.NODE_ENV === "production" ? "warning" : false,
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico",
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      append: false,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "static/css/[name].[hash:8].css",
    }),
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopyWebpackPlugin([
      {from: path.join(cesiumSource, cesiumWorkers),to: "Workers" },
      { from: path.join(cesiumSource, "../Build/Cesium/Assets"),to: "Assets",},
      {from: path.join(cesiumSource, "../Build/Cesium/Widgets"),to: "Widgets",
      },
      {from: path.join(cesiumSource, "../Build/Cesium/ThirdParty"),to: "ThirdParty",
      },
      { from: "data", to: "app/simulation/data", ignore: ["**/.git/**"] },
    ]),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify("/"),
    }),
    // new BundleAnalyzerPlugin()
  ],
};
