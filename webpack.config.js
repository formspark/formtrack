module.exports = {
  devtool: "inline-source-map",
  output: {
    filename: "index.js",
    library: "Formtrack",
    libraryTarget: "umd",
    libraryExport: "default",
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [{ test: /\.ts?$/, loader: "ts-loader", exclude: /node_modules/ }],
  },
};
