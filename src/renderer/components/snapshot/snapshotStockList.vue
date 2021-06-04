<template>
  <table class="table table-striped jambo_table bulk_action table-bordered">
    <thead>
      <tr class="headings">
        <th>종목</th>
        <th>연결계좌</th>
        <th>종류</th>
        <th>상장국가</th>
        <th>매수금액(원)</th>
        <th>평가금액(원)</th>
        <th>수익금(원)</th>
        <th>수익률(%)</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in stockEvaluateList" :key="item.stockSeq" style="cursor: pointer">
        <td>{{ item.name }}</td>
        <td>{{ item.accountSeq | accountName }}</td>
        <td>{{ item.typeName }}</td>
        <td>{{ item.nationName }}</td>
        <td class="text-right">{{ item.buyAmount | numberFormat }}</td>
        <td class="text-right">{{ item.evaluateAmount | numberFormat }}</td>
        <td :style="{ color: getGainsColor(getRealGains(item)) }" class="text-right">
          {{ getRealGains(item) | numberFormat }}
        </td>
        <td :style="{ color: getGainsColor(getRealGains(item)) }" class="text-right">
          {{ calcEarningRate(item) }}
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th colspan="4">합계</th>
        <th class="text-right">{{ stockBuyAmountSum | numberFormat }}</th>
        <th class="text-right">{{ stockEvaluateAmountSum | numberFormat }}</th>
        <th :style="{ color: getGainsColor(stockIncoming) }" class="text-right">
          {{ stockIncoming | numberFormat }}
        </th>
        <td :style="{ color: getGainsColor(stockIncoming) }" class="text-right">
          {{ ((stockIncoming / stockBuyAmountSum) * 100).toFixed(1) }}
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script type="text/javascript">
import _ from "lodash";
import snapshotMixin from "./snapshot-mixin.js";

export default {
  data() {
    return {};
  },
  props: {
    stockEvaluateList: {
      type: Array,
      required: true,
    },
  },
  mixins: [snapshotMixin],
  computed: {
    stockBuyAmountSum() {
      return _.sumBy(this.stockEvaluateList, "buyAmount");
    },
    stockEvaluateAmountSum() {
      return _.sumBy(this.stockEvaluateList, "evaluateAmount");
    },
    // 전체 수익금액
    stockIncoming() {
      return this.stockEvaluateAmountSum - this.stockBuyAmountSum;
    },
  },
  mounted() {},
  methods: {},
};
</script>
