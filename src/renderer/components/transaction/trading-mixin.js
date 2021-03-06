export default {
  data() {
    return {
      tradingList: [],
    };
  },
  computed: {
    sumBuying() {
      return this.sumTrading((t) => t.kind == "BUYING");
    },
    sumSell() {
      return this.sumTrading((t) => t.kind == "SELL");
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
    sumTrading(filterCondition) {
      return this.tradingList.filter(filterCondition).reduce((acc, t) => {
        return acc + t.price * t.quantity;
      }, 0);
    },
    getRealSellGains(trade) {
      return trade.sellGains - trade.tax - trade.fee;
    },
    // 수익율%
    calcEarningRate(tradingItem) {
      if(tradingItem.kind == "BUYING") {
        return 0;
      }
      const realSellGains = this.getRealSellGains(tradingItem);
      let sell = tradingItem.price * tradingItem.quantity;
      let buy = sell - realSellGains;
      return ((realSellGains / buy) * 100).toFixed(1);
    },
  },
};