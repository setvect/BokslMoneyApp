<template>
  <table class="table table-bordered jambo_table" style="width: 800px">
    <thead>
      <tr class="headings">
        <th>계좌성격</th>
        <th>합산금액(원)</th>
        <th>평가금액(원)</th>
        <th>수익금(원)</th>
        <th>수익률(%)</th>
        <th>합산금액 비중(%)</th>
        <th>평가금액 비중(%)</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="asset in assetGroups" :key="asset.assetGroupSeq">
        <td>{{ asset.accountTypeName }}</td>
        <td class="text-right">{{ asset.totalAmount | numberFormat }}</td>
        <td class="text-right">{{ asset.evaluateAmount | numberFormat }}</td>
        <td class="text-right" :style="{ color: getGainsColor(asset.evaluateAmount - asset.totalAmount) }">
          {{ (asset.evaluateAmount - asset.totalAmount) | numberFormat }}
        </td>
        <td class="text-right" :style="{ color: getGainsColor(asset.evaluateAmount - asset.totalAmount) }">
          {{ (((asset.evaluateAmount - asset.totalAmount) / asset.totalAmount) * 100).toFixed(1) }}
        </td>
        <td class="text-right">
          <span v-if="asset.totalAmount > 0">
            {{ ((asset.totalAmount / totalAmountPlusSum) * 100).toFixed(1) }}
          </span>
          <span v-else>-</span>
        </td>
        <td class="text-right">
          <span v-if="asset.evaluateAmount > 0">
            {{ ((asset.evaluateAmount / evaluateAmountPlusSum) * 100).toFixed(1) }}
          </span>
          <span v-else>-</span>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th>합계</th>
        <th class="text-right">{{ totalAmountSum | numberFormat }}</th>
        <th class="text-right">{{ evaluateAmountSum | numberFormat }}</th>
        <th class="text-right" :style="{ color: getGainsColor(evaluateAmountSum - totalAmountSum) }">
          {{ (evaluateAmountSum - totalAmountSum) | numberFormat }}
        </th>
        <th class="text-right" :style="{ color: getGainsColor(evaluateAmountSum - totalAmountSum) }">
          {{ (((evaluateAmountSum - totalAmountSum) / totalAmountSum) * 100).toFixed(1) }}
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
    assetGroups: {
      type: Array,
      required: true,
      default: function() {
        return [];
      },
    },
  },
  computed: {
    totalAmountSum() {
      return _.sumBy(this.assetGroups, "totalAmount");
    },
    evaluateAmountSum() {
      return _.sumBy(this.assetGroups, "evaluateAmount");
    },
    // 플러스 자산만 합산
    totalAmountPlusSum() {
      return _.chain(this.assetGroups)
        .filter((p) => p.totalAmount > 0)
        .sumBy("totalAmount");
    },
    // 플러스 자산만 합산
    evaluateAmountPlusSum() {
      return _.chain(this.assetGroups)
        .filter((p) => p.evaluateAmount > 0)
        .sumBy("evaluateAmount");
    },
  },
  mounted() {},
  methods: {},
};
</script>
