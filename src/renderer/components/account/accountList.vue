<template>
  <div class="col-md-12 col-sm-12 col-xs-12">
    <div class="form-row">
      <div class="form-group col-md-3">
        <label>재산(내가 모은 돈)</label>
        <span class="form-control text-right">{{ property | numberFormat }}</span>
      </div>
      <div class="form-group col-md-3">
        <label>주식</label>
        <span class="form-control text-right">{{ sumTotalStock | numberFormat }}</span>
      </div>
      <div class="form-group col-md-3">
        <label>자산(마이너스가 아닌 계좌 합)</label>
        <span class="form-control text-right">{{ asset | numberFormat }}</span>
      </div>
      <div class="form-group col-md-2">
        <label>부채(마이너스 계좌 합)</label>
        <span class="form-control text-right">{{ debt | numberFormat }}</span>
      </div>
      <div class="form-group col-md-1">
        <label>필터링</label>
        <b-form-checkbox v-model="enableFilter" @change="list">활성 계좌만 </b-form-checkbox>
      </div>
    </div>
    <table class="table table-striped jambo_table bulk_action table-bordered" id="grid">
      <thead>
        <tr class="headings">
          <th>자산종류</th>
          <th>계좌성격</th>
          <th>이름</th>
          <th>잔고</th>
          <th>주식 매수가</th>
          <th>이율</th>
          <th>계좌(카드)번호</th>
          <th>월 납입액</th>
          <th>만기일</th>
          <th>주식계좌</th>
          <th>메모</th>
          <th>활성</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in accountFilterList" :key="item.accountSeq" style="cursor: pointer">
          <td>{{ item.kindName }}</td>
          <td>{{ item.accountTypeName }}</td>
          <td>
            <a @click="readForm(item)" href="javascript:void(0)">{{ item.name }}</a>
          </td>
          <td class="text-right">{{ item.balance | numberFormat }}</td>
          <td class="text-right">{{ sumStock(item.accountSeq) | numberFormat }}</td>
          <td>{{ item.interestRate }}</td>
          <td>{{ item.accountNumber }}</td>
          <td>{{ item.monthlyPay }}</td>
          <td>{{ item.expDate }}</td>
          <td class="text-center">
            <button
              v-show="item.stockF"
              @click="addStock(item.accountSeq)"
              type="button"
              class="btn btn-success btn-xs"
            >
              주식 등록
            </button>
            <button
              v-show="item.stockF"
              @click="openStockList(item.accountSeq)"
              type="button"
              class="btn btn-success btn-xs"
            >
              목록 ({{ item.stockList.length }})
            </button>
          </td>
          <td class="td-ell">{{ item.note }}</td>
          <td class="text-center">{{ item.enableF ? "예" : "아니오" }}</td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 10px">
      <button type="button" class="btn btn-success" @click="addForm()">추가</button>
      <button type="button" class="btn btn-success" style="margin: 0; float: right" @click="exportExcel()">
        내보내기(엑셀)
      </button>
    </div>
  </div>
</template>

<script type="text/javascript">
import _ from "lodash";
import "datatables";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables/media/css/jquery.dataTables.css";

import "../../common/vue-common.js";
import accountMixin from "./account-mixin.js";

export default {
  data() {
    return {
      itemList: [],
      gridTable: null,
      // 정렬 조건 유지하기 위함
      order: [0, "asc"],
      enableFilter: true,
      accountFilterList: [],
    };
  },
  mixins: [accountMixin],
  props: {},
  computed: {
    property() {
      return this.asset + this.debt;
    },
    sumTotalStock() {
      return _.sumBy(this.stockList, "purchaseAmount");
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
  mounted() {
    this.loadBasicInfo(() => {
      this.list();
    });
  },
  methods: {
    // 리스트
    list() {
      ElectronUtil.invoke("account/listItem", {}, (result) => {
        if (this.gridTable != null) {
          this.gridTable.destroy();
        }
        this.itemList = result;
        if (this.enableFilter) {
          this.accountFilterList = this.itemList.filter((s) => s.enableF);
        } else {
          this.accountFilterList = this.itemList;
        }
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

          // 엑셀 다운로드 button 감추기
          $(".buttons-excel").hide();
        });
      });
    },
    readForm(item) {
      this.$parent.$refs.popupRead.openReadForm(item);
    },
    // 등록 폼
    addForm() {
      this.$parent.$refs.popupAdd.openAddForm({ enableF: 1, stockF: 0, });
    },
    addStock(accountSeq) {
      this.$parent.$refs.stockAdd.openAddForm({ accountSeq, });
    },
    openStockList(accountSeq) {
      this.$parent.$refs.stockList.openForm(accountSeq);
    },
    // 엑셀 다운로드
    exportExcel() {
      const csvData = [];
      csvData.push([
        "자산종류",
        "계좌성격",
        "이름",
        "잔고",
        "주식 매수가",
        "이률",
        "계좌(카드)번호",
        "월 납입액",
        "만기일",
        "메모"
      ]);
      this.itemList.forEach((item) => {
        const record = [];
        record.push(item.kindName);
        record.push(item.accountTypeName);
        record.push(item.name);
        record.push(item.balance.toString());
        record.push(this.sumStock(item.accountSeq).toString());
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
    loadFilterList() {},
  },
};
</script>

<style>
table a {
  text-decoration: underline;
}
</style>
