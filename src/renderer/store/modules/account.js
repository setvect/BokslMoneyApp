const acount = {
  state: {
    accountList: [],
    currentacountSeq: 0,
  },
  mutations: {
    setAcount: (state, acountList) => {
      state.acountList = acountList;
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