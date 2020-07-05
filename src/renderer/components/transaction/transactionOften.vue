<template>
  <div id="addOftenItem" class="modal fade" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{actionType == 'add' ? '등록' : '수정'}}</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <form class="form-horizontal">
            <div class="col-md-12 col-sm-12 col-xs-12">
              <div class="form-group row">
                <label class="control-label col-md-3 col-sm-3 col-xs-3">거래 제목:</label>
                <div class="col-md-9 col-sm-9 col-xs-9">
                  <input id="titleField" type="text" class="form-control" name="title" v-model="item.title" v-validate="'required'" data-vv-as="거래 제목 " />
                  <div v-if="errors.has('title')">
                    <span class="error">{{errors.first('title')}}</span>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-3 col-sm-3 col-xs-3">항목:</label>
                <div class="col-md-9 col-sm-9 col-xs-9">
                  <div class="input-group no-padding">
                    <input type="text" class="form-control" readonly="readonly" name="item" v-model="itemPath" v-validate="'required'" data-vv-as="항목 " />
                    <span class="input-group-btn">
                      <button class="btn btn-default" type="button" @click="openCategoryList(item.kind)">선택</button>
                    </span>
                  </div>
                  <div v-if="errors.has('item')">
                    <span class="error">{{errors.first('item')}}</span>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-3 col-sm-3 col-xs-3">메모:</label>
                <div class="col-md-9 col-sm-9 col-xs-9">
                  <input type="text" class="form-control" name="note" v-model="item.note" v-validate="'required'" data-vv-as="메모 " />
                  <span class="error" v-if="errors.has('note')">{{errors.first('note')}}</span>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-3 col-sm-3 col-xs-3">금액:</label>
                <div class="col-md-9 col-sm-9 col-xs-9">
                  <my-currency-input v-model="item.money" class="form-control" name="money" maxlength="10" v-validate="'required'" data-vv-as="금액 "></my-currency-input>
                  <span class="error" v-if="errors.has('money')">{{errors.first('money')}}</span>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-3 col-sm-3 col-xs-3">출금계좌:</label>
                <div class="col-md-9 col-sm-9 col-xs-9">
                  <select class="form-control" v-model="item.payAccount" name="payAccount" v-validate="validatePay" data-vv-as="지출계좌 " :disabled="disablePay">
                    <option
                      v-for="account in accountList"
                      v-bind:value="account.accountSeq"
                      :key="account.accountSeq"
                    >{{account.name}} : {{account.balance | numberFormat}}원 ({{account.accountNumber}})</option>
                  </select>
                  <span class="error" v-if="errors.has('payAccount')">{{errors.first('payAccount')}}</span>
                </div>
              </div>
              <div class="form-group row">
                <label class="control-label col-md-3 col-sm-3 col-xs-3">입금계좌:</label>
                <div class="col-md-9 col-sm-9 col-xs-9">
                  <select class="form-control" v-model="item.receiveAccount" name="receiveAccount" v-validate="validateReceive" data-vv-as="수입계좌 " :disabled="disableReceive">
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
                <label class="control-label col-md-3 col-sm-3 col-xs-3">속성:</label>
                <div class="col-md-9 col-sm-9 col-xs-9">
                  <select class="form-control" v-model="item.attribute" name="attribute" v-validate="'required'" data-vv-as="속성 ">
                    <option v-for="attribute in getAttributeList(item.kind)" v-bind:value="attribute.codeItemSeq" :key="attribute.codeItemSeq">{{attribute.name}}</option>
                  </select>
                  <span class="error" v-if="errors.has('attribute')">{{errors.first('attribute')}}</span>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" @click="addAction()">저장</button>
          <button type="button" class="btn btn-default" @click="close()">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import transactionMixin from "./transaction-mixin.js";

export default {
  data() {
    return {
      item: { money: 0, kind: null, },
      itemPath: null,
      actionType: "null",
    };
  },
  computed: {
    // 출금계좌 선택 박스 비활성
    disablePay() {
      return this.item.kind == "INCOME";
    },
    // 수입계좌 선택 박스 비활성
    disableReceive() {
      return this.item.kind == "SPENDING";
    },
    validatePay() {
      return this.disablePay ? "" : "required";
    },
    validateReceive() {
      if (this.item.kind == "SPENDING") {
        return "";
      }
      // 이체에서는 지출계좌와 수입 계좌가 같으면 안됨.
      if (this.item.kind == "TRANSFER") {
        return { required: true, notEquals: this.item.payAccount, };
      }
      return "required";
    },
  },
  mixins:[transactionMixin],
  methods: {
    // 자주 쓰는 계좌
    openForm(actionType, item) {
      this.actionType = actionType;
      this.item = item;
      if (actionType == "add") {
        this.item.title = "";
      }

      if (item.parentCategory && item.category) {
        this.insertCategory(item.parentCategory, item.category);
        delete item.category;
        delete item.parentCategory;
      }
      $("#addOftenItem").off().on("shown.bs.modal", () => {
        // TODO 동작 안함, 왜 안되는지 모르겠음.
        $("#titleField").focus();
      });
      $("#addOftenItem").modal();
    },
    close() {
      $("#addOftenItem").modal("hide");
    },
    // 항목 선택 팝업.
    openCategoryList(kind) {
      this.$parent.$refs.popupCategory.openCategoryList(kind, this.insertCategory);
    },
    // 항목 팝업에서 선택한 값 입력
    insertCategory(mainItem, subItem) {
      this.item.categorySeq = subItem.categorySeq;
      this.itemPath = mainItem.name + " > " + subItem.name;
    },
    // 등록 또는 수정
    addAction() {
      this.$validator.validateAll().then((result) => {
        if(!result) {
          return;
        }
        let serviceName = this.actionType == "add" ? "oftenUsed/addItem" : "oftenUsed/editItem";
        ElectronUtil.invoke(serviceName, this.item, () => {
          $("#addOftenItem").modal("hide");
          this.$parent.loadOftenUsed();
        });
      });
    },
  },
  mounted() {
  },
};
</script>