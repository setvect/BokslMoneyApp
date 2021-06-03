export default {
  data() {
    return {};
  },
  methods: {
    getRealGains(item) {
      return item.evaluateAmount - item.buyAmount;
    },
    // 수익율%
    calcEarningRate(item) {
      const realSellGains = this.getRealGains(item);
      return ((realSellGains / item.buyAmount) * 100).toFixed(1);
    },
  },
};