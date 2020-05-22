<template>
  <div class="col-md-12 col-sm-12 col-xs-12">
    <div class="form-row">
      <div class="form-group col-md-4">
        <label for="inputCity">재산(내가 모은 돈)</label>
        <span class="form-control text-right">{{property | numberFormat}}</span>
      </div>
      <div class="form-group col-md-4">
        <label for="inputCity">자산(마이너스가 아닌 계좌 합)</label>
        <span class="form-control text-right">{{asset | numberFormat}}</span>
      </div>
      <div class="form-group col-md-4">
        <label for="inputCity">부채(마이너스 계좌 합)</label>
        <span class="form-control text-right">{{debt | numberFormat}}</span>
      </div>
    </div>
    <table class="table table-striped jambo_table bulk_action table-bordered" id="grid">
      <thead>
        <tr class="headings">
          <th>자산종류</th>
          <th>이름</th>
          <th>잔고</th>
          <th>이율</th>
          <th>계좌(카드)번호</th>
          <th>월 납입액</th>
          <th>만기일</th>
          <th>메모</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in itemList" :key="item.accountSeq" @click="readForm(item)" style="cursor: pointer">
          <td>{{item.kindName}}</td>
          <td>{{item.name}}</td>
          <td class="text-right">{{item.balance | numberFormat}}</td>
          <td>{{item.interestRate}}</td>
          <td>{{item.accountNumber}}</td>
          <td>{{item.monthlyPay}}</td>
          <td>{{item.expDate}}</td>
          <td class="td-ell">{{item.note}}</td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top:10px;">
      <button type="button" class="btn btn-success" @click="addForm()">추가</button>
      <button type="button" class="btn btn-success" style="margin: 0;float: right" @click="exportExcel();">내보내기(엑셀)</button>
    </div>
  </div>
</template>

<script type="text/javascript">
import "datatables";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables/media/css/jquery.dataTables.css";

import ElectronUtil from "../../common/electron-util.js";
import CommonUtil from "../../common/common-util.js";
import "../../common/vue-common.js";

export default {
  data() {
    return {
      itemList: [],
      gridTable: null,
      // 정렬 조건 유지하기 위함
      order: [0, "asc"],
    };
  },
  props: {},
  computed: {
    property() {
      return this.asset + this.debt;
    },
    asset() {
      let value = this.itemList.reduce(function(acc, item) {
        if (item.balance > 0) {
          return acc + item.balance;
        }
        return acc;
      }, 0);
      return value;
    },
    debt() {
      let value = this.itemList.reduce(function(acc, item) {
        if (item.balance < 0) {
          return acc + item.balance;
        }
        return acc;
      }, 0);
      return value;
    },
  },
  methods: {
    // 리스트
    list() {
      ElectronUtil.invoke("account/listItem", this.currentMainCode, result => {
        if (this.gridTable != null) {
          this.gridTable.destroy();
        }
        this.itemList = result;
        this.$nextTick(() => {
          this.gridTable = $("#grid").DataTable({
            paging: false,
            bInfo: false,
            searching: false,
            dom: "Bfrtip",
            buttons: [
              {
                extend: "excelHtml5",
                title: "복슬머니 계좌목록",
                customize: function(xlsx) {
                  var sheet = xlsx.xl.worksheets["sheet1.xml"];
                  $("row c", sheet).attr("s", "25");
                },
              }
            ],
          });

          this.gridTable.order(this.order).draw();
          $("#grid").on("order.dt", () => {
            if (this.gridTable.order().length == 0) {
              return;
            }
            this.order = this.gridTable.order()[0];
          });

          // 엑셀 다운로드 button 감추기
          $(".buttons-excel").hide();
        });
      });
    },
    readForm(item) {
      this.$EventBus.$emit("readFormEvent", item);
    },
    // 등록 폼
    addForm() {
      this.$parent.$refs.popupAdd.openAddForm({});
    },
    // 엑셀 다운로드
    exportExcel() {
      const csvData = [];
      csvData.push(["자산종류", "이름", "잔고", "이률", "계좌(카드)번호", "월 납입액", "만기일", "메모"]);
      this.itemList.forEach(item => {
        const record = [];
        record.push(item.kindName);
        record.push(item.name);
        record.push(item.balance.toString());
        record.push(item.interestRate);
        record.push(item.accountNumber);
        record.push(item.monthlyPay);
        record.push(item.expDate);
        record.push(item.note);
        csvData.push(record);
      });

      const csvString = CommonUtil.convertHtmlTable(csvData);
      CommonUtil.download(csvString, "계좌목록.xls", "text/html;encoding:utf-8");
    },
  },
  mounted() {
    this.list();
  },
};
</script>

<style>
</style>
