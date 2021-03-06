import Vue from "vue";
import axios from "axios";

import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";

import BootstrapVue from "bootstrap-vue";

import VeeValidate from "vee-validate";
import ko from "vee-validate/dist/locale/ko";

import commonMixin from "./common/common-mixin.js";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "font-awesome/css/font-awesome.min.css";
import "@/assets/custom.css";
import "@/assets/app.css";

if (!process.env.IS_WEB) {
  Vue.use(require("vue-electron"));
}
Vue.use(BootstrapVue);
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(VeeValidate, {
  locale: "ko",
  events: "blur",
  dictionary: {
    ko,
  },
});
Vue.mixin(commonMixin);
new Vue({
  components: { App, },
  router,
  store,
  template: "<App/>",
}).$mount("#app");
