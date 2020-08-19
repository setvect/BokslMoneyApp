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
      console.log("item.tradingSeq :>> ", item.tradingSeq);
      ElectronUtil.invoke("trading/deleteItem", item.tradingSeq, () => this.reload());
    },
    // 수입, 지출, 이체 합산
    sumCalculation(filterCondition) {
      return this.tradingList.filter(filterCondition).reduce((acc, t) => {
        return acc + t.price * t.quantity;
      }, 0);
    },
  },
};