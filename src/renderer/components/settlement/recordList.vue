<template>
  <div id="recordListModal" class="modal fade" role="dialog">
    <div class="modal-dialog modal-xl">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{condition.from | dateFormat("YYYY.MM.DD")}} ~ {{condition.to | dateFormat("YYYY.MM.DD")}} {{getKindAttr(kindType).title}} 내역 (총: {{sum |
            numberFormat}})
          </h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body" style="max-height: 600px; overflow: auto;">
          <table ref="dataTable" class="table table-striped jambo_table bulk_action table-bordered">
            <thead>
              <tr class="headings">
                <th>No</th>
                <th>유형</th>
                <th>메모</th>
                <th>대분류</th>
                <th>소분류</th>
                <th>금액</th>
                <th>수수료</th>
                <th>출금계좌</th>
                <th>입금계좌</th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in transactionList" :key="idx">
                <td>{{idx + 1}}</td>
                <td :style="{color:getKindAttr(item.kind).color}" style="font-weight: bold">{{getKindAttr(item.kind).title}}</td>
                <td>{{item.note}}</td>
                <td>{{categoryMap[item.category.parentSeq].name}}</td>
                <td>{{item.category.name}}</td>
                <td class="text-right">{{item.money | numberFormat}}</td>
                <td class="text-right">{{item.fee | numberFormat}}</td>
                <td>{{item.payAccount | accountName}}&nbsp;</td>
                <td>{{item.receiveAccount | accountName}}&nbsp;</td>
                <td>{{item.transactionDate | dateFormat('YYYY.MM.DD')}}</td>
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

import transactionMixin from "../../components/transaction/transaction-mixin.js";
import "../../common/vue-common.js";
import CommonUtil from "../../common/common-util";

// vue 객체 생성
export default {
  mixins: [transactionMixin],
  data: function() {
    return {
      // 검색 조건
      condition: {
        kindTypeSet: [],
        from: moment(),
        to: moment(),
        categorySeq: 0,
        note: "",
      },
      kindType: "SPENDING",
    };
  },
  computed: {
    sum() {
      let sum = _.sumBy(this.transactionList, t => t.money);
      return sum;
    },
  },
  mounted() { },
  methods: {
    //  거래 내역 다시 조회
    reload() {
      this.search();
    },
    // 거래내역 조회
    loadTransaction() {
      ElectronUtil.invoke("transaction/listItem", this.condition, result=>{
        this.transactionList = result;
      });
    },
    openForm(from, to, kind, categorySeq) {
      this.condition.kindTypeSet = [];

      this.condition.from = from.toDate();
      this.condition.to = to.toDate();
      this.condition.kindTypeSet.push(kind);
      this.condition.categorySeq = categorySeq;

      this.kindType = kind;
      this.loadTransaction();
      $("#recordListModal").modal();
    },
    // 엑셀 다운로드
    exportExcel() {
      let html = this.$refs.dataTable;
      const htmlText = CommonUtil.replaceAll(html.outerHTML, "<table", "<table border='1'");
      CommonUtil.download(htmlText, `결산(${CommonUtil.formatDate(this.condition.from, "YYYY.MM.DD")}_${CommonUtil.formatDate(this.condition.to, "YYYY.MM.DD")}).xls`, "text/html;encoding:utf-8");
    },
  },
};
</script>
