const webpack = require("webpack");
const path = require("path");
console.log("###############################");
console.log("###############################");
console.log("path.resolve(__dirname, \"src/renderer/common/electron-util.js\") :>> ", path.resolve(__dirname, "src/renderer/common/electron-util.js"));
console.log("###############################");
console.log("###############################");


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
    })
  ],
};

