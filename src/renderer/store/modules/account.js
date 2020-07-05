import _ from "lodash";

const acount = {
  state: {
    accountList: [],
    accountMap: {},
  },
  mutations: {
    setAcount: (state, accountList) => {
      state.accountList = accountList;
      state.accountMap = _.keyBy(accountList, "accountSeq");
    },
  },
  actions: {
    // 제가 접속 가능한 프로젝트 목록
    loadAcount({
      commit,
    }) {
      return new Promise((resolve, reject) => {
        ElectronUtil.invoke("account/listItem", {}, result=>{
          commit("setAcount", result);
          resolve();
        }, {
          errorCall: error => {
            reject(error);
          },
        });
      });
    },
  },
};

export default acount;