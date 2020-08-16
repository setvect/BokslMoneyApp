import {
  TRADING_VALUE
} from "../../common/constant.js";
export default {
  data() {
    return {
      tradingList: [],
    };
  },
  methods: {
    // 유형에 따른 UI 표현 속성값
    getStockKindAttr(kind) {
      return TRADING_VALUE[kind];
    },
  },
};