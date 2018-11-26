const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlWebPackPlugin = new HtmlWebPackPlugin({
  template: "./index.html",
  filename: "./index.html"
});

module.exports = {
  entry: "./src/index.tsx",
  devServer: {
    clientLogLevel: "none",
    hot: true,
    inline: true,
    port: 44416,
    historyApiFallback: true,
    publicPath: "/dist",
    disableHostCheck: true,
    stats: {
        colors: true,
        chunks: false
    }
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /(node_modules|tests|src\/Stores\/__mocks__)/,
        use: [
          { loader: "babel-loader" },
          {
            loader: "ts-loader",
            options: {
              // disable type checker 
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [htmlWebPackPlugin]
};