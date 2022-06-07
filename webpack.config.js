const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const paths = require("./config/paths");
const autoprefixer = require("autoprefixer");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
process.env.NODE_ENV = "production";
// process.env.SERVER_BASE_URL = `34.212.20.211`;
// const { BugsnagSourceMapUploaderPlugin } = require('webpack-bugsnag-plugins')
function srcPath(subdir) {
  return path.join(__dirname, "src", subdir);
}

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: `static/js/[name].[chunkhash:8]${new Date().getTime()}.js`,
    chunkFilename: `static/js/[name].[chunkhash:8]${new Date().getTime()}.chunk.js`,
  },
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
  },
  mode: "production",
  optimization: {
    minimize: true,
  },
  stats: "none",
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        loader: require.resolve("source-map-loader"),
        query: {
          plugins: ["transform-runtime"],
          presets: ["react", "stage-0"],
        },
        enforce: "pre",
        include: paths.appSrc,
      },
      {
        oneOf: [
          {
            test: /\.(ts|tsx)$/,
            include: paths.appSrc,

            use: [
              {
                loader: require.resolve("ts-loader"),
                options: {
                  transpileOnly: true,
                },
              },
            ],
          },
          {
            test: /.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
            use: "url-loader?limit=1024&name=fonts/[name].[ext]",
          },
          {
            test: /\.(jpg|jpeg|gif|png|ico)$/,
            use:
              "url-loader?limit=10&mimetype=image/(jpg|jpeg|gif|png)&name=images/[name].[ext]",
          },
          {
            test: /\.(css|scss)$/,
            include: paths.appSrc,
            use: [
              {
                loader: "style-loader", // creates style nodes from JS strings
              },
              {
                loader: "css-loader", // translates CSS into CommonJS
              },
              {
                loader: "sass-loader", // compiles Sass to CSS
              },
            ],
          },
          {
            test: /\.css$/,
            use: [
              require.resolve("style-loader"),
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve("postcss-loader"),
                options: {
                  ident: "postcss",
                  plugins: () => [
                    require("postcss-flexbugs-fixes"),
                    autoprefixer({
                      browsers: [">1%", "last 4 versions", "Firefox ESR"],
                      flexbox: "no-2009",
                    }),
                  ],
                },
              },
            ],
          },
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      src: srcPath("src"),
      components: path.resolve(__dirname, "src/components/"),
      icons: path.resolve(__dirname, "src/components/icons"),
    },
    extensions: [".tsx", ".ts", ".js"],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify('production'),
        // 'SERVER_BASE_URL': JSON.stringify(process.env.SERVER_BASE_URL)
      },
    }),
    new SWPrecacheWebpackPlugin({
      // By default, a cache-busting query parameter is appended to requests
      // used to populate the caches, to ensure the responses are fresh.
      // If a URL is already hashed by Webpack, then there is no concern
      // about it being stale, and the cache-busting can be skipped.
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: "service-worker.js",
      logger(message) {
        if (message.indexOf("Total precache size is") === 0) {
          // This message occurs for every build and is a bit too noisy.
          return;
        }
        if (message.indexOf("Skipping static resource") === 0) {
          // This message obscures real errors so we ignore it.
          // https://github.com/facebookincubator/create-react-app/issues/2612
          return;
        }
        console.log(message);
      },
      minify: true,
      // For unknown URLs, fallback to the index page
      navigateFallback: paths.publicUrl + "/index.html",
      // Ignores URLs starting from /__ (useful for Firebase):
      // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
  ],
};
