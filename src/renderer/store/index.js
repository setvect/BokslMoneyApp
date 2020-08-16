import Vue from "vue";
import Vuex from "vuex";

import account from "./modules/account.js";
import stock from "./modules/stock.js";
import category from "./modules/category.js";
import code from "./modules/code.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules:{
    account,
    stock,
    category,
    code,
  },
  getters: {
    accountList: state => state.account.accountList,
    accountMap: state => state.account.accountMap,
    stockList: state => state.stock.stockList,
    stockMap: state => state.stock.stockMap,
    categoryList: state => state.category.categoryList,
    categoryMap: state => state.category.categoryMap,
    codeList: state => state.code.codeList,
    codeMap: state => state.code.codeMap,
  },
  strict: process.env.NODE_ENV !== "production",
});
