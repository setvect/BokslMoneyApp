<template>
  <div>
    <div class="page-title">
      <div class="title_left">
        <h3>지출/수입/이체</h3>
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
                <tr v-for="spending in categorySpedingList" :key="spending.categorySeq">
                  <td>{{spending.name}}</td>
                  <td class="text-right" v-for="month in monthList" :key="month.valueOf()" @click="openList(month, spending.kind, spending.categorySeq)">
                    {{getSpending(month.month(),
                    spending.categorySeq) | numberFormat}}
                  </td>
                </tr>
                <tr class="info" v-for="kindMap in kindList" :key="Object.keys(kindMap)[0]">
                  <td>{{Object.values(kindMap)[0]}}</td>
                  <td
                    class="text-right"
                    v-for="month in monthList"
                    :key="month.valueOf()"
                    @click="openList(month, Object.keys(kindMap)[0],0)"
                  >{{getKindSum(month.month(), Object.keys(kindMap)[0])| numberFormat}}</td>
                </tr>
                <tr class="success">
                  <td>수입-지출</td>
                  <td class="text-right" v-for="month in monthList" :key="month.valueOf()">{{getKindSum(month.month(), 'INCOME') - getKindSum(month.month(), 'SPENDING') | numberFormat}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <record-list ref="recordListPopup"></record-list>
  </div>
</template>

<script type="text/javascript">
import {
  mapGetters
} from "vuex";

import moment from "moment";
import "../../common/vue-common.js";
import recordListComponent from "./recordList.vue";

const currentYear = new Date().getFullYear();

// vue 객체 생성
export default {
  name:"settlementAccount",
  data: function() {
    return {
      spendingList: [],
      year: currentYear,
      yearChoice: currentYear,
      spendingGroupSum: {},
      kindGroupSum: {},
    };
  },
  components: {
    recordList: recordListComponent,
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
    // 유형 리스트
    kindList() {
      return [
        { SPENDING: "지출합계", },
        { INCOME: "수입합계", },
        { TRANSFER: "이체합계", }
      ];
    },
  },
  mounted() {
    this.loadBasicInfo(()=>{
      this.runSettlement();
    });
  },
  methods: {
    // 결산
    runSettlement() {
      this.year = this.yearChoice;
      ElectronUtil.invoke("settlement/groupOfMonth", { year: this.year, kind: "SPENDING", }, result=>{
        this.spendingGroupSum = result;
        ElectronUtil.invoke("settlement/groupKindOfMonth", { year: this.year, }, result =>{
          this.kindGroupSum = result;
        });
      });
    },
    // 선택항목 거래 내역 조회
    // month: mement 객체
    openList(month, kind, parentCategorySeq) {
      let from = month.clone();
      let to = month
        .clone()
        .add("month", 1)
        .add("second", -1);

      let subCategorySeqSet = null;
      if(parentCategorySeq != 0) {
        subCategorySeqSet = this.categoryList.filter(c=>c.parentSeq == parentCategorySeq).map(c=>c.categorySeq);
      }
      this.$refs.recordListPopup.openForm(from, to, kind, subCategorySeqSet);
    },
    // month: 0부터 시작,
    // categorySeq: 대분류 아이디
    getSpending(month, categorySeq) {
      let monthGroup = this.spendingGroupSum[month];
      if (!monthGroup) {
        return 0;
      }
      return monthGroup[categorySeq] || 0;
    },
    // month: 0부터 시작,
    // kind: 유형
    getKindSum(month, kind) {
      let monthGroup = this.kindGroupSum[month];
      if (!monthGroup) {
        return 0;
      }
      return monthGroup[kind] || 0;
    },
    // 엑셀 다운로드
    exportExcel() {
      let html = this.$refs.dataTable;
      const htmlText = CommonUtil.replaceAll(html.outerHTML, "<table", "<table border='1'");
      CommonUtil.download(htmlText, `결산(${this.year}).xls`, "text/html;encoding:utf-8");
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