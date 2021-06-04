<template>
  <table class="table table-bordered jambo_table" style="width: 800px">
    <thead>
      <tr class="headings">
        <th>구분</th>
        <th>매수금액(원)</th>
        <th>평가금액(원)</th>
        <th>수익금(원)</th>
        <th>수익률(%)</th>
        <th>매수금액 비중(%)</th>
        <th>평가금액 비중(%)</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="stock in stockGroupList" :key="stock.name">
        <td>{{ stock.name }}</td>
        <td class="text-right">{{ stock.buyAmount | numberFormat }}</td>
        <td class="text-right">{{ stock.evaluateAmount | numberFormat }}</td>
        <td class="text-right" :style="{ color: getGainsColor(stock.realGains) }">
          {{ stock.realGains | numberFormat }}
        </td>
        <td class="text-right" :style="{ color: getGainsColor(stock.realGains) }">
          {{ stock.earningRate | numberFormat }}
        </td>
        <td class="text-right">{{ ((stock.buyAmount / buyAmountSum) * 100).toFixed(1) }}</td>
        <td class="text-right">{{ ((stock.evaluateAmount / evaluateAmountSum) * 100).toFixed(1) }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th>합계</th>
        <th class="text-right">{{ buyAmountSum | numberFormat }}</th>
        <th class="text-right">{{ evaluateAmountSum | numberFormat }}</th>
        <th class="text-right" :style="{ color: getGainsColor(incomingSum) }">{{ incomingSum | numberFormat }}</th>
        <th class="text-right" :style="{ color: getGainsColor(incomingSum) }">
          {{ ((incomingSum / buyAmountSum) * 100).toFixed(1) }}
        </th>
        <th class="text-center" colspan="2">-</th>
      </tr>
    </tfoot>
  </table>
</template>

<script type="text/javascript">
import _ from "lodash";
export default {
  data() {
    return {};
  },
  props: {
    stockEvaluateList: {
      type: Array,
      required: true,
    },
    groupField: {
      type: String,
      require: true,
    },
  },
  computed: {
    buyAmountSum() {
      return _.sumBy(this.stockGroupList, "buyAmount");
    },
    evaluateAmountSum() {
      return _.sumBy(this.stockGroupList, "evaluateAmount");
    },
    // 전체 수익금액
    incomingSum() {
      return this.evaluateAmountSum - this.buyAmountSum;
    },
    stockGroupList() {
      return _.chain(this.stockEvaluateList)
        .groupBy(this.groupField)
        .map((groupList, id) => {
          const buyAmount = _.sumBy(groupList, "buyAmount");
          const evaluateAmount = _.sumBy(groupList, "evaluateAmount");
          const realGains = evaluateAmount - buyAmount;
          const earningRate = ((realGains / buyAmount) * 100).toFixed(1);
          return {
            name: id,
            buyAmount,
            evaluateAmount,
            realGains,
            earningRate,
          };
        })
        .value();
    },
  },
  mounted() {},
  methods: {},
};
</script>
