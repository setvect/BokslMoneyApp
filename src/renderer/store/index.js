import Vue from "vue";
import Vuex from "vuex";

import account from "./modules/account.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules:{
    account,
  },
  getters: {
    accountList: state => state.account.accountList,
  },
  strict: process.env.NODE_ENV !== "production",
});
