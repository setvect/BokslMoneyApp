import _ from "lodash";

const stock = {
  state: {
    stockList: [],
    stockMap: {},
  },
  mutations: {
    setStock: (state, stockList) => {
      state.stockList = stockList;
      state.stockMap = _.keyBy(stockList, "stockSeq");
    },
  },
  actions: {
    // 제가 접속 가능한 프로젝트 목록
    loadStock({
      commit,
    }) {
      return new Promise((resolve, reject) => {
        ElectronUtil.invoke("stock/listItem", null, result=>{
          commit("setStock", result);
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

export default stock;