const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      "window.jQuery": "jquery",
      $: "jquery",
      jQuery: "jquery",
      "window.$": "jquery",
      Swal: "sweetalert2",
      moment: "moment"
    }),
  ],
};
