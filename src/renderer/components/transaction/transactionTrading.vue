<template>
  <div id="stockAddFrom" class="modal fade" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div v-if="this.item != null" class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">주식 매매 {{actionType == 'add' ? '등록' : '수정'}}</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <form>
            <div class="col-md-12 col-sm-12 col-xs-12">
              <div class="form-group row">
                <label class="col-form-label col-md-2">날짜:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <div class="col-sm-7" style="padding:0;">
                    <input v-model="item.tradingDate" v-once type="text" class="form-control has-feedback-left _datepicker" placeholder="First Name" readonly="readonly" />
                    <span class="fa fa-calendar-o form-control-feedback left" aria-hidden="true"></span>
                  </div>
                  <div class="col-sm-5" style="padding-left:4px;">
                    <button type="button" class="btn btn-dark" style="margin-right: 0px;" @click="addDate(-1)">전날</button>
                    <button type="button" class="btn btn-dark" style="margin-right: -3px;" @click="addDate(1)">다음날</button>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">거래계좌:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <select class="form-control" v-model="accountSeq" @change="item.stockSeq = 0" name="accountSeq" v-validate="'required|greaterThanZero'" data-vv-as="거래 계좌 ">
                    <option v-for="account in stockAccountList" :value="account.accountSeq" :key="account.accountSeq">{{account.name}} : {{account.balance | numberFormat}}원 ({{account.accountNumber}})</option>
                  </select>
                  <span class="error" v-if="errors.has('accountSeq')">{{errors.first('accountSeq')}}</span>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">종목:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <select class="form-control" v-model="item.stockSeq" name="stockSeq" v-validate="'required|greaterThanZero'" data-vv-as="종목 ">
                    <option :value="0">==선택해라==</option>
                    <option v-for="stock in stockList" v-bind:value="stock.stockSeq" :key="stock.stockSeq">
                      {{stock.name}} : {{stock.quantity | numberFormat}}주
                      ({{stock.purchaseAmount | numberFormat}}원, 평단가: {{(Math.round(stock.purchaseAmount / stock.quantity))| numberFormat}}원)
                    </option>
                  </select>
                  <span class="error" v-if="errors.has('stockSeq')">{{errors.first('stockSeq')}}</span>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">메모:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <input id="stockMemoField" type="text" class="form-control _note" name="note" v-model="item.note" v-validate="'max:50'" data-vv-as="메모 " />
                  <span class="error" v-if="errors.has('note')">{{errors.first('note')}}</span>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">유형:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <label class="form-check-label">
                    <input v-model="item.kind" type="radio" :value="'BUYING'" />
                    매수
                  </label>
                  <label class="form-check-label">
                    <input v-model="item.kind" type="radio" :value="'SELL'" />
                    매도
                  </label>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">수량:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <my-currency-input v-model="item.quantity" @press-enter="addAction(true)" class="form-control" name="quantity" maxlength="10" v-validate="'required'" data-vv-as="수량 "></my-currency-input>
                  <span class="error" v-if="errors.has('quantity')">{{errors.first('quantity')}}</span>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">단가:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <my-currency-input v-model="item.price" @press-enter="addAction(true)" class="form-control" name="price" maxlength="10" v-validate="'required'" data-vv-as="단가 "></my-currency-input>
                  <span class="error" v-if="errors.has('price')">{{errors.first('price')}}</span>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">거래세:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <my-currency-input v-model="item.tax" class="form-control" name="tax" maxlength="7"></my-currency-input>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">수수료:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <my-currency-input v-model="item.fee" class="form-control" name="fee" maxlength="7"></my-currency-input>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" @click="addAction(true)" v-show="this.actionType == 'add'">계속입력</button>
          <button type="button" class="btn btn-info" @click="addAction(false)">저장</button>
          <button type="button" class="btn btn-secondary" @click="close()">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import moment from "moment";
import "daterangepicker";
import "daterangepicker/daterangepicker.css";
import "jquery-ui/ui/core";
import "jquery-ui/ui/widgets/autocomplete.js";
import "jquery-ui/themes/base/all.css";
import {
  mapGetters
} from "vuex";
import transactionMixin from "./transaction-mixin.js";
import store from "../../store/index.js";

export default {
  name: "transactionTrading",
  data() {
    return {
      item: null,
      accountSeq: null,
      actionType: "add",
      itemPath: null,
      selectDate: null,
      // 모달 창 닫을 시 부모 페이지를 리로딩 할 지 여부
      closeReload: false,
    };
  },
  created() {
    this.$validator.extend(
      "greaterThanZero", {
        getMessage: field => field + " 선택하세요.",
        validate: (value) => {
          // value must be > zero
          if (value > 0) {
            return true;
          }
          return false;
        },
      });
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "accountList"
    ]),
    stockAccountList() {
      return this.accountEnableList.filter((a) => a.stockF);
    },
    // 주식 항목
    stockList() {
      if (this.accountSeq) {
        let account = this.accountList.find((a) => a.accountSeq == this.accountSeq);
        return account.stockList.filter((s) => s.enableF);
      }
      return [];
    },
  },
  mixins: [transactionMixin],
  methods: {
    // 등록 폼
    openAddForm(date) {
      this.actionType = "add";
      this.item = { stockSeq: 0, price: 0, fee: 0, tax: 0, quantity: 0, kind: "BUYING", },
      this.selectDate = date;
      this.item.tradingDate = this.selectDate.format("YYYY-MM-DD");
      delete this.item.tradingSeq;
      this.openForm();
    },
    // 수정 폼
    openEditForm(item) {
      this.actionType = "edit";
      this.selectDate = moment(item.tradingDate);
      this.item = item;
      this.item.tradingDate = this.selectDate.format("YYYY-MM-DD");
      this.openForm();
    },
    // datepicker
    updateDate(d) {
      this.item.tradingDate = d;
    },
    // 현재 날짜 조정
    addDate(diff) {
      this.selectDate.add(diff, "days");
      this.item.tradingDate = this.selectDate.format("YYYY-MM-DD");
      $("#stockAddFrom ._datepicker").data("daterangepicker").setStartDate(this.selectDate.format("YYYY-MM-DD"));
    },
    // 계좌 입력 팝업창.
    openForm() {
      const stockSeq = this.item.stockSeq;
      const stock = store.state.stock.stockMap[stockSeq];
      if (stock != null) {
        this.accountSeq = stock.accountSeq;
      }
      this.loadOftenUsed();
      this.closeReload = false;

      $("._datepicker").daterangepicker(
        {
          singleDatePicker: true,
          singleClasses: "",
          showDropdowns: true,
          startDate: this.selectDate.format("YYYY-MM-DD"),
        },
        (start) => {
          this.item.tradingDate = start.format("YYYY-MM-DD");
        }
      );
      this.$validator.reset();
      $("#stockAddFrom")
        .off()
        .on("hidden.bs.modal", () => {
          if (this.closeReload) {
            this.$parent.reload();
          }
        })
        .on("shown.bs.modal", () => {
          $("#stockMemoField").focus();
        });
      $("#stockAddFrom").modal();
    },
    // 등록 또는 수정
    // cont. true: 연속입력, false: 입력후 모달 닫기
    addAction(cont) {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }
        let actionName = this.actionType == "add" ? "trading/addItem" : "trading/editItem";

        ElectronUtil.invoke(actionName, this.item, (result) => {
          this.closeReload = true;
          if (cont && this.actionType == "add") {
            this.item.note = "";
            this.item.price = 0;
            this.item.quantity = 0;
            this.item.tax = 0;
            this.item.fee = 0;
            // 포커스가 제대로 안되서 timeout 적용. $nextTick 안됨.
            setTimeout(() => $("#stockMemoField").focus(), 100);
          } else {
            $("#stockAddFrom").modal("hide");
          }
          this.loadBasicInfo();
        });
      });
    },
    close() {
      $("#stockAddFrom").modal("hide");
    },
    // 자주쓰는 거래 정보
    loadOftenUsed() {
      ElectronUtil.invoke("oftenUsed/listItem", this.item.kind, (result) => {
        this.oftenUsedList = result;
      });
    },
  },
};
</script>

<style scoped>
.form-control-feedback {
  position: absolute;
  top: -2px;
  z-index: 2;
  display: block;
  text-align: left;
  pointer-events: none;
}
.form-control-feedback.left {
  padding-right: 8px;
}
.modal-lg {
  max-width: 900px;
}
</style>