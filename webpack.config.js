const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { dependencies } = require("./package.json");
const whiteListedModules = ["vue", "bootstrap-vue"];

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader"
      }
    ]
  },
  externals: [
    ...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d))
  ],
  plugins: [new VueLoaderPlugin()]
};
