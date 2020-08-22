<template>
  <div>
    <div class="page-title">
      <div class="title_left">
        <h3>주식</h3>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div class="form-inline" style="padding: 0 10px;">
            <div class="form-group">
              <select class="form-control" v-model="yearChoice">
                <option value>--결산 년도 선택--</option>
                <option :value="year" v-for="year in yearList" :key="year">{{year}}년</option>
              </select>
            </div>
            <button type="submit" class="btn btn-secondary" style="margin: 0 10px;" @click="runSettlement()">조회</button>
            <button type="button" class="btn btn-success ml-auto" style="margin: 0;float: right" @click="exportExcel();">내보내기(엑셀)</button>
          </div>

          <div class="col-md-12 col-sm-12 col-xs-12">
            <table ref="dataTable" class="table jambo_table bulk_action table-bordered">
              <thead>
                <tr class="headings">
                  <th class="text-center">항목</th>
                  <th class="text-center" v-for="month in monthList" :key="month.valueOf()">{{month | dateFormat("YYYY년 MM월")}}</th>
                </tr>
              </thead>
              <tbody>
                <tr class="info">
                  <td>매수</td>
                  <td class="text-right" v-for="month in monthList" :key="month.valueOf()">{{getTradingSum(month.month(), "BUYING")| numberFormat}}</td>
                </tr>
                <tr class="info">
                  <td>매도</td>
                  <td class="text-right" v-for="month in monthList" :key="month.valueOf()">{{getTradingSum(month.month(), "SELL")| numberFormat}}</td>
                </tr>
                <tr class="info">
                  <td>거래세</td>
                  <td class="text-right" v-for="month in monthList" :key="month.valueOf()">{{getTradingSum(month.month(), "TAX")| numberFormat}}</td>
                </tr>
                <tr class="info">
                  <td>수수료</td>
                  <td class="text-right" v-for="month in monthList" :key="month.valueOf()">{{getTradingSum(month.month(), "FEE")| numberFormat}}</td>
                </tr>
                <tr class="success">
                  <td>매도차익</td>
                  <td class="text-right" v-for="month in monthList" :key="month.valueOf()" @click="openList(month)">{{getTradingSum(month.month(), "SELL_GAINS")| numberFormat}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <trading-list ref="tradingListPopup" />
  </div>
</template>

<script type="text/javascript">
import {
  mapGetters
} from "vuex";

import moment from "moment";
import "../../common/vue-common.js";
import tradingListComponent from "./tradingList.vue";

const currentYear = new Date().getFullYear();

// vue 객체 생성
export default {
  name:"settlementStock",
  data: function() {
    return {
      year: currentYear,
      yearChoice: currentYear,
      tradingGroupSum: {},
    };
  },
  components: {
    tradingList: tradingListComponent,
  },
  computed: {
    ...mapGetters([
      "categoryList"
    ]),
    // 상위 카테고리 중 지출항목망
    categorySpedingList() {
      return this.categoryList.filter(c=>c.parentSeq == 0 && c.kind == "SPENDING");
    },
    monthList() {
      let start = moment([this.year, 0, 1]);
      let months = [];
      for (let m = 0; m < 12; m++) {
        months.push(start.clone().add(m, "month"));
      }
      return months;
    },
  },
  mounted() {
    this.runSettlement();
  },
  methods: {
    // 결산
    runSettlement() {
      this.year = this.yearChoice;
      ElectronUtil.invoke("settlement/groupTradingKindOfMonth", { year: this.year, }, result =>{
        this.tradingGroupSum = result;
      });
    },
    // 선택항목 거래 내역 조회
    // month: mement 객체
    openList(month) {
      let from = month.clone();
      let to = month
        .clone()
        .add("month", 1)
        .add("second", -1);

      this.$refs.tradingListPopup.openForm(from, to);
    },
    // month: 0부터 시작,
    // kind: BUYING, SELL, TAX, FEE, SELL_GAINS
    getTradingSum(month, kind) {
      let monthGroup = this.tradingGroupSum[month];
      if (!monthGroup) {
        return 0;
      }
      return monthGroup[kind] || 0;
    },
    // 엑셀 다운로드
    exportExcel() {
      let html = this.$refs.dataTable;
      const htmlText = CommonUtil.replaceAll(html.outerHTML, "<table", "<table border='1'");
      CommonUtil.download(htmlText, `주식매매(${this.year}).xls`, "text/html;encoding:utf-8");
    },
  },
};
</script>

<style>
.info td {
  background-color: #d9edf7;
}
.success td {
  background-color: #dff0d8;
}
</style>