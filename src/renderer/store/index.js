import Vue from "vue";
import Vuex from "vuex";

import { createPersistedState, createSharedMutations } from "vuex-electron";

import account from "./modules/account.js";

Vue.use(Vuex);

export default new Vuex.Store({
  account,
  plugins: [
    createPersistedState(),
    createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== "production",
});
