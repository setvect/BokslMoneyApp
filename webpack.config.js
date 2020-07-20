const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
let clientPath = path.resolve(__dirname, "src/renderer");
module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      "window.jQuery": "jquery",
      $: "jquery",
      jQuery: "jquery",
      "window.$": "jquery",
      Swal: "sweetalert2",
      moment: "moment",
      ElectronUtil: [path.resolve(__dirname, "src/renderer/common/electron-util.js"), "default"],
      CommonUtil: [path.resolve(__dirname, "src/renderer/common/common-util.js"), "default"],
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: clientPath + "/index.html",
      inject: true,
      title: "vue-admin-template",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    })
  ],
};


