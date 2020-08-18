export default {
  data() {
    return {
      tradingList: [],
    };
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
      ElectronUtil.invoke("trading/deleteItem", item.tradingSeq, () => this.reload());
    },
  },
};