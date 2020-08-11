<template>
  <div id="stockAddFrom" class="modal fade" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
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
                  <select class="form-control" v-model="item.receiveAccount" name="receiveAccount" v-validate="'required'" data-vv-as="거래 계좌 ">
                    <option
                      v-for="account in accountList"
                      v-bind:value="account.accountSeq"
                      :key="account.accountSeq"
                    >{{account.name}} : {{account.balance | numberFormat}}원 ({{account.accountNumber}})</option>
                  </select>
                  <span class="error" v-if="errors.has('receiveAccount')">{{errors.first('receiveAccount')}}</span>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">종목:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <select class="form-control" v-model="item.stockSeq" name="stockSeq" v-validate="'required'" data-vv-as="종목 ">
                    <option v-for="stock in stockList" v-bind:value="stock.accountSeq" :key="stock.accountSeq">{{stock.name}} : {{stock.quantity | numberFormat}}원 ({{stock.purchaseAmount}})</option>
                  </select>
                  <span class="error" v-if="errors.has('stockSeq')">{{errors.first('stockSeq')}}</span>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">메모:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <input id="memoField" type="text" class="form-control _note" name="note" v-model="item.note" v-validate="'required'" data-vv-as="메모 " />
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
                <label class="control-label col-md-2 col-sm-2 col-xs-2">단가:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <my-currency-input v-model="item.price" @press-enter="addAction(true)" class="form-control" name="price" maxlength="10" v-validate="'required'" data-vv-as="단가 "></my-currency-input>
                  <span class="error" v-if="errors.has('price')">{{errors.first('price')}}</span>
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
                <label class="control-label col-md-2 col-sm-2 col-xs-2">속성:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <select class="form-control" v-model="item.attribute" name="attribute" v-validate="'required'" data-vv-as="속성 ">
                    <option v-for="attribute in getAttributeList(item.kind)" :value="attribute.codeItemSeq" :key="attribute.codeItemSeq">{{attribute.name}}</option>
                  </select>
                  <span class="error" v-if="errors.has('attribute')">{{errors.first('attribute')}}</span>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">세금:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <my-currency-input v-model="item.tax" class="form-control" name="tax" maxlength="5"></my-currency-input>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">수수료:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <my-currency-input v-model="item.fee" class="form-control" name="fee" maxlength="5"></my-currency-input>
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

import transactionMixin from "./transaction-mixin.js";

export default {
  name:"transactionStock",
  data() {
    return {
      item: { price: 0, fee: 0, tax:0, quantity:0, kind: "BUYING", },
      actionType: "add",
      itemPath: null,
      selectDate: null,
      // 모달 창 닫을 시 부모 페이지를 리로딩 할 지 여부
      closeReload: false,
      stockList:[],
    };
  },
  computed: {
  },
  mixins:[transactionMixin],
  methods: {
    // 등록 폼
    openAddForm(date) {
      this.actionType = "add";
      this.selectDate = date;
      this.insertCategory(this.item.parentCategory, this.item.category);
      this.item.transactionDate = this.selectDate.format("YYYY-MM-DD");
      delete this.item.transactionSeq;
      this.openForm(this.item.kind);
    },
    // 수정 폼
    openEditForm(transaction) {
      this.actionType = "edit";
      this.selectDate = moment(transaction.transactionDate);
      this.item = transaction;
      this.item.transactionDate = this.selectDate.format("YYYY-MM-DD");
      let parentCategory = this.categoryMap[transaction.category.parentSeq];
      this.insertCategory(parentCategory, transaction.category);
      this.openForm(this.item.kind);
    },
    // datepicker
    updateDate(d) {
      this.item.transactionDate = d;
    },
    // 현재 날짜 조정
    addDate(diff) {
      this.selectDate.add(diff, "days");
      this.item.transactionDate = this.selectDate.format("YYYY-MM-DD");
      $("._datepicker").data("daterangepicker").setStartDate(this.selectDate.format("YYYY-MM-DD"));
    },
    // 계좌 입력 팝업창.
    openForm(kind) {
      this.item.kind = kind;
      this.loadOftenUsed();
      this.closeReload = false;

      $("._datepicker").daterangepicker({
        singleDatePicker: true,
        singleClasses: "",
        showDropdowns: true,
        startDate: this.selectDate.format("YYYY-MM-DD"),
      }, (start) => {
        this.item.transactionDate = start.format("YYYY-MM-DD");
      });
      this.$validator.reset();
      $("#stockAddFrom").off().on("hidden.bs.modal", () => {
        if (this.closeReload) {
          this.$parent.reload();
        }
      }).on("shown.bs.modal", () =>{
        $("#memoField").focus();
      });

      $("#stockAddFrom").modal();

      // 메모 입력시 관련 카테고리 추천
      $("._note").autocomplete({
        source: (request, response) => {
          let note = request.term;
          ElectronUtil.invoke("/category/listRecommend", { note: note, kind: this.item.kind, }, (result) => {
            response(result);
          }, { waitDialog: false, });
        },
        focus: () => false,
        select: (event, ui) => {
          let parentCategory = this.categoryMap[ui.item.parentSeq];
          this.insertCategory(parentCategory, ui.item);
          return false;
        },
      }).data("ui-autocomplete")._renderItem = (ul, item) =>{
        let parentCategory = this.categoryMap[item.parentSeq];
        return $("<li>")
          .append("<div>" + parentCategory.name + " > " + item.name + "</div>")
          .appendTo(ul);
      };
    },
    // 등록 또는 수정
    // cont. true: 연속입력, false: 입력후 모달 닫기
    addAction(cont) {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }
        this.beforeTransaction[this.item.kind] = $.extend(true, {}, this.item);

        delete this.item.category;
        delete this.item.parentCategory;

        let actionName = this.actionType == "add" ? "transaction/stockAddFrom" : "transaction/editItem";

        ElectronUtil.invoke(actionName, this.item, (result)=>{
          this.closeReload = true;
          if (cont && this.actionType == "add") {
            this.item.note = "";
            this.item.money = "";
            // 포커스가 제대로 안되서 timeout 적용. $nextTick 안됨.
            setTimeout(()=> $("#memoField").focus(), 100);
          } else {
            $("#stockAddFrom").modal("hide");
          }
        });
      });
    },
    close() {
      $("#stockAddFrom").modal("hide");
    },
    // 자주쓰는 거래 정보
    loadOftenUsed() {
      ElectronUtil.invoke("oftenUsed/listItem", this.item.kind, (result)=>{
        this.oftenUsedList = result;
      });
    },
    // 항목 선택 팝업.
    openCategoryList(kind) {
      this.$refs.popupCategory.openCategoryList(kind, this.insertCategory);
    },
    // 항목 팝업에서 선택한 값 입력
    insertCategory(mainItem, subItem) {
      this.itemPath = "";
      if (mainItem) {
        this.item.categorySeq = subItem.categorySeq;
        this.itemPath = mainItem.name + " > " + subItem.name;
      }
    },
    // 자주쓰는 거래 선택
    selectOftenUsed(often) {
      this.item = Object.assign(this.item, $.extend(true, {}, often));
      if (this.item.money == 0) {
        this.item.money = "";
      }
      ElectronUtil.invoke("category/getOne", this.item.categorySeq, (result)=>{
        this.item.category = result;
        this.item.parentCategory = result.parentCategory;
        this.insertCategory(this.item.parentCategory, this.item.category);
      }, { waitDialog: false, });
    },
    // 자주쓰는 거래 팝업 열기
    // actionType: add, edit
    // often: 거래 내역항목
    openOften(actionType, often) {
      this.$refs.popupOften.openForm(actionType, $.extend(true, {}, often));
    },
    // 자주 쓰는 거래 신규 등록
    // 현재 입력한 값을 전달
    openOftenAdd() {
      let copyItem = $.extend(true, {}, this.item);
      if (!copyItem.categorySeq) {
        this.openOften("add", copyItem);
        return;
      }

      ElectronUtil.invoke("category/getOne", this.item.categorySeq, (result)=>{
        copyItem.category = result;
        copyItem.parentCategory = result.parentCategory;
        delete copyItem.oftenUsedSeq;
        this.openOften("add", copyItem);
      });
    },
    openOftenEdit(often) {
      let copyItem = $.extend(true, {}, often);
      ElectronUtil.invoke("category/getOne", copyItem.categorySeq, (result)=>{
        copyItem.category = result;
        copyItem.parentCategory = result.parentCategory;
        this.openOften("edit", copyItem);
      });
    },
    // 정렬 순서 변경
    changeOrder(downOftenUsedSeq, upOftenUsedSeq) {
      let param = { downOftenUsedSeq: downOftenUsedSeq, upOftenUsedSeq: upOftenUsedSeq, };
      ElectronUtil.invoke("oftenUsed/changeOrder", param, ()=>{
        this.loadOftenUsed();
      });
    },
    // 자주 쓰는 거래 삭제
    deleteOftenForm(oftenUsedSeq) {
      if (!confirm("삭제할거야?")) {
        return;
      }
      ElectronUtil.invoke("oftenUsed/deleteItem", oftenUsedSeq, ()=>{
        this.loadOftenUsed();
      });
    },
    isUpable(index) {
      if (this.oftenUsedList <= 1) {
        return false;
      }
      return index !== 0;
    },
    isDownable(index) {
      if (this.oftenUsedList.length <= 1) {
        return false;
      }
      return index + 1 !== this.oftenUsedList.length;
    },
  },
  mounted() {
  },
  created() {
    // 커스텀 validation
    this.$validator.extend("notEquals", {
      getMessage: function(field, args) {
        return "같은 계좌를 지정할 수 없습니다.";
      },
      validate: function(value, args) {
        return value != args[0];
      },
    });
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