/* global process, __dirname, module */
const postcssConfig = "./config/postcss/postcss.config.js";
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const projectDir = path.resolve(`${__dirname}/..`);
const webpack = require("webpack");

const isDev = process.env.NODE_ENV !== "production";
const prod = process.env.NODE_ENV === "production";
/**
 *  Settings chapter
 */

const additionalPlugins = [];

/**
 * UglifyJS only in prod mode
 */
if (prod) {
  additionalPlugins.push(
    new UglifyJSPlugin({
      test: /\.js($|\?)/i,
      parallel: true,
      sourceMap: isDev,
      uglifyOptions: {
        mangle: true
      }
    })
  );
}

console.log("NODE_ENV:", process.env.NODE_ENV);

const config = {
  context: projectDir + "/src",
  entry: {
    index: "./index.ts",
    balance: "./balance.ts"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  devtool: "source-map",
  devServer: {
    open: true
  },
  output: {
    filename: isDev ? "[name].js" : "[name].[chunkhash].js",
    path: path.resolve(projectDir, "build")
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: isDev
            }
          },
          {
            loader: "postcss-loader",
            options: {
              config: { path: postcssConfig },
              sourceMap: isDev
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: isDev
            }
          },
          {
            loader: "postcss-loader",
            options: {
              config: {
                path: postcssConfig
              },
              sourceMap: isDev ? "inline" : false
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDev
            }
          }
        ]
      },
      {
        test: /\.(png|jpeg|jpg|gif|woff|woff2|eot|otf|ttf|svg)$/,
        use: "file-loader?name=assets/[name].[ext]"
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader"
        }
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    compress: true,
    port: 3000
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production") // default value if not specified
      }
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    new CleanWebpackPlugin(["build/"], {
      root: projectDir
    }), // avoid Duplicated CSS files with different hash
    new HtmlWebpackPlugin({
      chunks: ["index"],
      template: "./index.html"
    }),
    new HtmlWebpackPlugin({
      chunks: ["balance"],
      template: "./balance.html",
      filename: 'balance.html'
    }),
    new LodashModuleReplacementPlugin(),
    new CopyWebpackPlugin(
      [
        {
          context: "../src",
          to: "",
          from: {
            glob: "assets/img/**/*",
            dot: true
          }
        }
      ],
      {
        ignore: [".gitkeep"],
        debug: "warning"
      }
    ),
    ...additionalPlugins
  ]
};

module.exports = config;
