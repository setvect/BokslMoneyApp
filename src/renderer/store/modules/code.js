import _ from "lodash";

const code = {
  state: {
    codeList: [],
    codeMap: {},
  },
  mutations: {
    setCode: (state, codeList) => {
      state.codeList = codeList;
      state.codeMap = _.groupBy(codeList, "codeMainId");
    },
  },
  actions: {
    // 제가 접속 가능한 프로젝트 목록
    loadCode({
      commit,
    }) {
      return new Promise((resolve, reject) => {
        ElectronUtil.invoke("code/listItem", null, result => {
          commit("setCode", result);
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

export default code;