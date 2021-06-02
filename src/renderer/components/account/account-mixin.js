import _ from "lodash";
import {
  mapGetters
} from "vuex";

export default {
  computed: {
    ...mapGetters([
      "stockList"
    ]),
  },
  methods: {
    sumStock(accountSeq) {
      let sum = _.chain(this.stockList).filter(stock => stock.accountSeq == accountSeq).sumBy("purchaseAmount").value();
      return sum;
    },
  },
};