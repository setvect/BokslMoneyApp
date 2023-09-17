<template>
  <table class="table table-striped jambo_table bulk_action table-bordered">
    <thead>
      <tr class="headings">
        <th>종목</th>
        <th>연결계좌</th>
        <th>수량</th>
        <th>단가</th>
        <th>합산금액</th>
        <th>매도차익</th>
        <th>수익률(%)</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="t in stockSellList" :key="t.tradingSeq">
        <td>{{ t.stockSeq | stockName }}</td>
        <td>{{ t.stockSeq | stockAccountName }}</td>
        <td class="text-right">{{ t.quantity | numberFormat }}</td>
        <td class="text-right">{{ t.price | numberFormat }}</td>
        <td class="text-right">{{ (t.price * t.quantity) | numberFormat }}</td>
        <td :style="{ color: getGainsColor(getRealSellGains(t)) }" class="text-right">
          {{ getRealSellGains(t) || 0 | numberFormat }}
        </td>
        <td :style="{ color: getGainsColor(getRealSellGains(t)) }" class="text-right">{{ calcEarningRate(t) }}%</td>
      </tr>
    </tbody>
  </table>
</template>

<script type="text/javascript">
import tradingMixin from "../../components/transaction/trading-mixin.js";
import "../../common/vue-common.js";

export default {
  mixins: [tradingMixin],
  data() {
    return {};
  },
  props: {
    stockSellList: {
      type: Array,
      required: true,
    },
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
