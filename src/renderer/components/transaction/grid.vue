<template>
  <div>
    <div class="page-title">
      <div class="title_left">
        <h3>표 입력</h3>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div v-cloak>
            <div class="col-md-9 col-sm-9 col-xs-12">
              <div class="form-inline">
                <div class="form-group">
                  <label for="memo_field">메모:</label>
                  <input v-model="condition.note" type="text" class="form-control" id="memo_field" @keyup.13="search()" />
                </div>
                <div class="checkbox form-group" style="margin:0 10px">
                  <label>
                    <input v-model="condition.kindTypeSet" type="checkbox" value="SPENDING" class="flat" /> 지출
                  </label>
                  <label>
                    <input v-model="condition.kindTypeSet" type="checkbox" value="INCOME" class="flat" /> 수입
                  </label>
                  <label>
                    <input v-model="condition.kindTypeSet" type="checkbox" value="TRANSFER" class="flat" /> 이체
                  </label>
                </div>
                <button type="button" class="btn btn-info" style="margin: 0" @click="search();">검색</button>
                <button type="button" class="btn btn-success ml-auto" style="margin: 0" @click="exportExcel();">내보내기(엑셀)</button>
              </div>

              <table class="table table-striped jambo_table bulk_action table-bordered" id="grid">
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
                    <th>기능</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in transactionList" :key="item.transactionSeq">
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
                    <td class="text-center">
                      <div class="btn-group btn-group-xs">
                        <button type="button" class="btn btn-success btn-sm" @click="editForm(item)">수정</button>
                        <button type="button" class="btn btn-dark btn-sm" @click="deleteAction(item)">삭제</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-12">
              <div class="pb-2 mt-4 mb-2 border-bottom">
                <button type="button" data-type="SPENDING" class="btn btn-info _input">지출</button>
                <button type="button" data-type="INCOME" class="btn btn-info _input">수입</button>
                <button type="button" data-type="TRANSFER" class="btn btn-info _input">이체</button>
              </div>
              <div>
                <div>
                  <div class="form-group row">
                    <label class="control-label col-sm-3" for="start_date">시작일:</label>
                    <div class="col-sm-9">
                      <input type="input" class="form-control _datepicker_from" readonly="readonly" placeholder="Enter start_date" name="start_date" />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="control-label col-sm-3" for="end_date">종료일:</label>
                    <div class="col-sm-9">
                      <input type="input" class="form-control _datepicker_to" readonly="readonly" placeholder="Enter end_date" name="end_date" />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="control-label col-sm-3" for="end_date">계좌:</label>
                    <div class="col-sm-9">
                      <select v-model="condition.accountSeq" class="form-control" name="account">
                        <option v-bind:value="0">== 전체 ==</option>
                        <option
                          v-for="account in accountList"
                          v-bind:value="account.accountSeq"
                          :key="account.accountSeq"
                        >{{account.name}} : {{account.balance | numberFormat}}원 ({{account.accountNumber}})</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-12 col-sm-12 col-xs-12 col-md-offset-3" style="margin: 10px 0">
                    <button type="button" class="btn btn-info btn-sm" @click="search();">조회</button>
                    <button type="button" class="btn btn-primary btn-sm" @click="moveMonth(-1)">이전달</button>
                    <button type="button" class="btn btn-primary btn-sm" @click="moveMonth(0)">이번달</button>
                    <button type="button" class="btn btn-primary btn-sm" @click="moveMonth(1)">다음달</button>
                  </div>
                  <div class="form-group"></div>
                  <div class="ln_solid" style="margin:10px 0;"></div>
                </div>
                <div>
                  <h4>{{condition.from | dateFormat("YYYY-MM-DD")}} ~ {{condition.to | dateFormat("YYYY-MM-DD")}} 결산</h4>
                  <table class="table table-bordered">
                    <tbody>
                      <tr>
                        <td>
                          <span :style="{color:getKindAttr('INCOME').color}" style="line-height: normal ">수입</span>
                        </td>
                        <td class="text-right">{{sumIncome | numberFormat}}</td>
                      </tr>
                      <tr>
                        <td>
                          <span :style="{color:getKindAttr('SPENDING').color}" style="line-height: normal ">지출</span>
                        </td>
                        <td class="text-right">{{sumSpending | numberFormat}}</td>
                      </tr>
                      <tr>
                        <td>
                          <span :style="{color:getKindAttr('INCOME').color}" style="line-height: normal ">수입</span> -
                          <span :style="{color:getKindAttr('SPENDING').color}" style="line-height: normal ">지출</span>
                        </td>
                        <td class="text-right">{{sumIncome - sumSpending | numberFormat}}</td>
                      </tr>
                      <tr>
                        <td>
                          <span :style="{color:getKindAttr('TRANSFER').color}" style="line-height: normal ">이체</span>
                        </td>
                        <td class="text-right">{{sumTransfer | numberFormat}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <add ref="popupAdd" />
    </div>
  </div>
</template>
<script type="text/javascript">
import moment from "moment";

import "datatables";
import "datatables/media/css/jquery.dataTables.css";
import "datatables.net-buttons";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.html5.js";


import "daterangepicker";
import "daterangepicker/daterangepicker.css";
import "iCheck/icheck.js";
import "iCheck/skins/all.css";

import transactionMixin from "../../components/transaction/transaction-mixin.js";
import itemAddComponent from "./transactionAdd.vue";
import "../../common/vue-common.js";

const NOW_DATE = new Date();
moment.locale("ko");

// vue 객체 생성
export default {
  name:"grid",
  mixins: [transactionMixin],
  data: function() {
    return {
      // 검색 조건
      condition: {
        kindTypeSet: ["INCOME", "SPENDING", "TRANSFER"],
        from: moment([NOW_DATE.getFullYear(), NOW_DATE.getMonth()]).toDate(),
        to: moment().toDate(),
        note: "",
        accountSeq: 0,
      },
      gridTable: null,
      // 정렬 조건 유지하기 위함
      order: [0, "asc"],
    };
  },
  components: {
    add: itemAddComponent,
  },
  computed: {},
  mounted() {
    this.loadBasicInfo(()=>{
      this.initUi();
      this.loadTransaction();
      // 지출, 이체, 수입 버튼 클릭
      $("._input").click(event => {
        let type = $(event.target).attr("data-type");
        this.addItemForm(type);
      });
    });
  },
  methods: {
    // UI 객체 초기화
    initUi() {
      let self = this;

      $("input.flat").iCheck({
        checkboxClass: "icheckbox_flat-green",
      });

      let kind = self.condition.kindTypeSet;
      $("input.flat").on("ifChecked", function(e) {
        kind.push($(this).val());
      });
      $("input.flat").on("ifUnchecked", function(e) {
        kind.splice(kind.indexOf($(this).val()), 1);
      });

      this.initDatepicker();
    },
    // datepicker 선택
    initDatepicker() {
      $("._datepicker_from").daterangepicker(
        {
          singleDatePicker: true,
          singleClasses: "",
          showDropdowns: true,
          startDate: this.condition.from,
        },
        from => {
          this.condition.from = from.toDate();
        }
      );

      $("._datepicker_to").daterangepicker(
        {
          singleDatePicker: true,
          singleClasses: "",
          showDropdowns: true,
          startDate: this.condition.to,
        },
        to => {
          this.condition.to = to.toDate();
        }
      );
    },
    initGrid() {
      this.gridTable = $("#grid").DataTable({
        paging: false,
        bInfo: false,
        searching: false,
        dom: "Bfrtip",
        buttons: [
          {
            extend: "excelHtml5",
            exportOptions: {
              columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
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
    },
    destroyGrid() {
      if (this.gridTable != null) {
        this.gridTable.destroy();
      }
    },
    //  거래 내역 다시 조회
    reload() {
      this.search();
    },
    // 거래내역 조회
    loadTransaction() {
      ElectronUtil.invoke("transaction/listItem", this.condition, result=>{
        this.destroyGrid();
        this.transactionList = result;
        this.$nextTick(() => {
          this.initGrid();
        });
      });
    },
    // 검색
    search() {
      this.loadTransaction();
    },
    // 달 이동
    moveMonth(diff) {
      let fromDate = moment(this.condition.from);
      fromDate.add(diff, "months");
      if (diff == 0) {
        fromDate = moment();
      }

      fromDate.date(1);
      let toDate = fromDate.clone();
      toDate.add(1, "months").add(-1, "Days");

      this.condition.from = fromDate.toDate();
      this.condition.to = toDate.toDate();
      this.initDatepicker();
      this.search();
    },
    // 엑셀 다운로드
    exportExcel() {
      const csvData = [];
      csvData.push(["유형", "메모", "대분류", "소분류", "금액", "수수료", "출금계좌", "입금계좌", "날짜"]);
      this.transactionList.forEach(item => {
        const record = [];
        record.push(this.getKindAttr(item.kind).title);
        record.push(item.note);
        record.push(this.categoryMap[item.category.parentSeq].name);
        record.push(item.category.name);
        record.push(item.money.toLocaleString());
        record.push(item.fee.toLocaleString());

        let payAccount = this.accountMap[item.payAccount];
        record.push(payAccount == null ? "" : payAccount.name);

        let receiveAccount = this.accountMap[item.receiveAccount];
        record.push(receiveAccount == null ? "" : receiveAccount.name);

        record.push(CommonUtil.formatDate(item.transactionDate, "YYYY.MM.DD"));
        csvData.push(record);
      });
      const csvString = CommonUtil.convertHtmlTable(csvData);
      let fromLabel = CommonUtil.formatDate(this.condition.from, "YYYY.MM.DD");
      let toLabel = CommonUtil.formatDate(this.condition.to, "YYYY.MM.DD");
      CommonUtil.download(csvString, `거래 내역(${fromLabel}~${toLabel}).xls`, "text/html;encoding:utf-8");
    },
  },
};
</script>

<style scoped>
.checkbox label {
  margin-right: 10px;
}
.form-inline {
  margin-bottom: 5px;
}
</style>
