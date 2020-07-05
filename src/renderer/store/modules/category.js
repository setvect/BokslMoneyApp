import _ from "lodash";

const category = {
  state: {
    categoryList: [],
    categoryMap: {},
  },
  mutations: {
    setCategory: (state, categoryList) => {
      state.categoryList = categoryList;
      state.categoryMap = _.keyBy(categoryList, "categorySeq");
    },
  },
  actions: {
    // 제가 접속 가능한 프로젝트 목록
    loadCategory({
      commit,
    }) {
      return new Promise((resolve, reject) => {
        ElectronUtil.invoke("category/list", {}, result=>{
          commit("setCategory", result);
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

export default category;