<template>
  <div id="stockListModal" class="modal fade" role="dialog">
    <div class="modal-dialog modal-xl">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">주식 목록</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body" style="max-height: 600px; overflow: auto;">
          <table ref="dataTable" class="table table-striped jambo_table bulk_action table-bordered">
            <thead>
              <tr class="headings">
                <th>No</th>
                <th>종목</th>
                <th>종류</th>
                <th>상장국가</th>
                <th>매수금액</th>
                <th>수량</th>
                <th>평단가</th>
                <th>종목상세</th>
                <th>메모</th>
                <th>활성</th>
                <th>기능</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in stockList" :key="idx">
                <td>{{idx + 1}}</td>
                <td>{{item.name}}</td>
                <td>{{item.typeName}}</td>
                <td>{{item.nationName}}</td>
                <td class="text-right">{{item.purchaseAmount | numberFormat}}</td>
                <td class="text-right">{{item.quantity | numberFormat}}</td>
                <td class="text-right">{{rating(item) | numberFormat}}</td>
                <td>
                  <a v-if="item.link" @click="openBrowser(item.link)" style="cursor:pointer" target="_blank">링크</a>
                </td>
                <td>{{item.note }}</td>
                <td class="text-center">{{item.enableF ? "예": "아니오"}}</td>
                <td class="text-center">
                  <div class="btn-group btn-group-xs">
                    <button type="button" class="btn btn-success btn-sm" @click="openEditForm(item)">수정</button>
                    <button type="button" class="btn btn-dark btn-sm" @click="deleteAction(item)">삭제</button>
                  </div>
                </td>
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
import "datatables";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.js";

import transactionMixin from "../../components/transaction/transaction-mixin.js";
import "../../common/vue-common.js";
import CommonUtil from "../../common/common-util";

// vue 객체 생성
export default {
  mixins: [transactionMixin],
  data: function() {
    return {
      stockList: [],
    };
  },
  computed: {},
  mounted() {},
  methods: {
    openForm(accountSeq) {
      this.loadStock(accountSeq);
      $("#stockListModal").modal();
    },
    // 거래내역 조회
    loadStock(accountSeq) {
      ElectronUtil.invoke("stock/listItem", accountSeq, (result) => {
        this.stockList = result;
      });
    },
    // 엑셀 다운로드
    exportExcel() {
      let html = this.$refs.dataTable;
      const htmlText = CommonUtil.replaceAll(html.outerHTML, "<table", "<table border='1'");
      CommonUtil.download(htmlText, "주식목록.xls", "text/html;encoding:utf-8");
    },
    openEditForm(item) {
      $("#stockListModal").modal("hide");
      this.$parent.$refs.stockAdd.openEditForm(item);
    },
    deleteAction(item) {
      if (!confirm("삭제?")) {
        return;
      }
      ElectronUtil.invoke("stock/deleteItem", item.stockSeq, () => {
        this.loadStock(item.accountSeq);
      });
    },
  },
};
</script>
