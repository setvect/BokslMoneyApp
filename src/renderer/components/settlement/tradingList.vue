<template>
  <div id="tradingListModal" class="modal fade" role="dialog">
    <div class="modal-dialog modal-xl">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{condition.from | dateFormat("YYYY.MM.DD")}} ~ {{condition.to | dateFormat("YYYY.MM.DD")}} 주식 매매 내역 (총: {{sum |
            numberFormat}})
          </h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body" style="max-height: 600px; overflow: auto;">
          <table ref="dataTable" class="table table-striped jambo_table bulk_action table-bordered">
            <thead>
              <tr class="headings">
                <th>유형</th>
                <th>내용</th>
                <th>종목</th>
                <th>단가</th>
                <th>수량</th>
                <th>매도 차익</th>
                <th>거래세</th>
                <th>수수료</th>
                <th>거래계좌</th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in tradingList" :key="t.tradingSeq">
                <td :style="{color:getKindAttr(t.kind).color}">{{getKindAttr(t.kind).title}}</td>
                <td>{{t.note}}</td>
                <td>{{t.stockSeq | stockName}}</td>
                <td class="text-right">{{t.price | numberFormat}}</td>
                <td class="text-right">{{t.quantity | numberFormat}}</td>
                <td :style="{color:getGainsColor(t.sellGains)}" class="text-right">{{t.sellGains || 0 | numberFormat}}</td>
                <td class="text-right">{{t.tax || 0 | numberFormat}}</td>
                <td class="text-right">{{t.fee || 0 | numberFormat}}</td>
                <td>{{t.stockSeq | stockAccountName}}</td>
                <td>{{t.tradingDate | dateFormat('YYYY.MM.DD')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="exportExcel();">내보내기(엑셀)</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
import _ from "lodash";

import tradingMixin from "../../components/transaction/trading-mixin.js";
import "../../common/vue-common.js";
import CommonUtil from "../../common/common-util";

// vue 객체 생성
export default {
  name: "tradingList",
  mixins: [tradingMixin],
  data: function() {
    return {
      // 검색 조건
      condition: {
        from: moment(),
        to: moment(),
      },
    };
  },
  computed: {
    sum() {
      let sum = _.sumBy(this.transactionList, t => t.money);
      return sum;
    },
  },
  mounted() {
    this.loadBasicInfo();
  },
  methods: {
    //  거래 내역 다시 조회
    reload() {
      this.search();
    },
    // 매매내역 조회
    loadList() {
      this.loadTrading(this.condition, ()=>{ });
    },
    openForm(from, to) {
      this.condition.kindTypeSet = [];
      this.condition.from = from.toDate();
      this.condition.to = to.toDate();

      this.loadList();
      $("#tradingListModal").modal();
    },

    // 엑셀 다운로드
    exportExcel() {
      let html = this.$refs.dataTable;
      const htmlText = CommonUtil.replaceAll(html.outerHTML, "<table", "<table border='1'");
      CommonUtil.download(htmlText, `주식 매매 내역(${CommonUtil.formatDate(this.condition.from, "YYYY.MM.DD")}_${CommonUtil.formatDate(this.condition.to, "YYYY.MM.DD")}).xls`, "text/html;encoding:utf-8");
    },
  },
};
</script>
