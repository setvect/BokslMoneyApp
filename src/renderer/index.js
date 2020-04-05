import Vue from "vue";
import axios from "axios";

import App from "./App";
import router from "./router";
import store from "./store";

import BootstrapVue from "bootstrap-vue";

import VeeValidate from "vee-validate";
import ko from "vee-validate/dist/locale/ko";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@/assets/custom.css";

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

let EventBus = new Vue();
Vue.prototype.$EventBus = EventBus

new Vue({
  components: { App },
  router,
  store,
  template: "<App/>",
}).$mount("#app");
