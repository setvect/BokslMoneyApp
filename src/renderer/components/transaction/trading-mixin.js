export default {
  data() {
    return {
      tradingList: [],
    };
  },
  computed: {
    sumBuying() {
      return this.sumCalculation((t) => t.kind == "BUYING");
    },
    sumSell() {
      return this.sumCalculation((t) => t.kind == "SELL");
    },
  },

  methods: {
    editTradingForm(item) {
      var d = $.extend(true, {}, item);
      this.$refs.trading.openEditForm(d);
    },
    deleteTradingAction(item) {
      if (!confirm("삭제하시겠습니까?")) {
        return;
      }
      ElectronUtil.invoke("trading/deleteItem", item.tradingSeq, () => {
        this.loadBasicInfo();
        this.reload();
      });
    },
    // 거래내역 조회
    loadTrading(condition, callBack) {
      ElectronUtil.invoke("trading/listItem", condition, result => {
        this.tradingList = result;
        callBack();
      });
    },
    // 매매 결과 합산
    sumCalculation(filterCondition) {
      return this.tradingList.filter(filterCondition).reduce((acc, t) => {
        return acc + t.price * t.quantity;
      }, 0);
    },
  },
};