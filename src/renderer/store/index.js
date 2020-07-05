import Vue from "vue";
import Vuex from "vuex";

import account from "./modules/account.js";
import category from "./modules/category.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules:{
    account,
    category,
  },
  getters: {
    accountList: state => state.account.accountList,
    accountMap: state => state.account.accountMap,
  },
  strict: process.env.NODE_ENV !== "production",
});
