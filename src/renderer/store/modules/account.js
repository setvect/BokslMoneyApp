
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
    loadMyacount({
      commit,
    }) {
      return new Promise((resolve, reject) => {
        // VueUtil.get(
        //   "/acount/myacount", {},
        //   res => {
        //     commit("setMyacount", res.data);
        //     resolve();
        //   }, {
        //     errorCall: error => {
        //       reject(error);
        //     },
        //   }
        // );
      });
    },
  },
};

export default acount;