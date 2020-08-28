<template>
  <div id="addStock" class="modal fade" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{actionType == 'add' ? '등록' : '수정'}}</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <form class="form-horizontal">
            <div class="form-group row">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">종목:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <input id="nameField" type="text" class="form-control" name="name" v-model="item.name" v-validate="'required|max:20'" data-vv-as="종목 " />
                <span class="error" v-if="errors.has('name')">{{errors.first('name')}}</span>
              </div>
            </div>
            <div class="form-group row">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">연결게좌:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <select class="form-control" name="accountSeq" v-model="item.accountSeq" v-validate="'required'" data-vv-as="연결계좌 ">
                  <option v-for="account in listStockAccount" :value="account.accountSeq" :key="account.accountSeq">{{ account.name }}</option>
                </select>
                <span class="error" v-if="errors.has('accountSeq')">{{errors.first('accountSeq')}}</span>
              </div>
            </div>
            <div class="form-group row">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">구입금액:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <my-currency-input
                  v-model="item.purchaseAmount"
                  class="form-control"
                  name="balance"
                  maxlength="10"
                  v-validate="'required|integer|max:11|between:-2000000000,2000000000'"
                  data-vv-as="구매금액 "
                  @press-enter="addAction(true)"
                ></my-currency-input>
                <span class="error" v-if="errors.has('purchaseAmount')">{{errors.first('purchaseAmount')}}</span>
              </div>
            </div>
            <div class="form-group row">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">수량:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <my-currency-input
                  v-model="item.quantity"
                  class="form-control"
                  name="quantity"
                  maxlength="10"
                  v-validate="'required|integer|max:11|between:0,999999999'"
                  data-vv-as="수량 "
                  @press-enter="addAction(true)"
                ></my-currency-input>
                <span class="error" v-if="errors.has('quantity')">{{errors.first('quantity')}}</span>
              </div>
            </div>
            <div class="form-group row">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">상세정보 링크:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <input type="text" class="form-control" name="link" v-model="item.link" v-validate="'max:100|url'" data-vv-as="상세정보 링크 " />
                <span class="error" v-if="errors.has('link')">{{errors.first('link')}}</span>
              </div>
            </div>
            <div class="form-group row">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">메모 내용:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <textarea class="form-control" name="note" v-model="item.note" v-validate="'max:500'" data-vv-as="메모 내용 "></textarea>
                <span class="error" v-if="errors.has('note')">{{errors.first('note')}}</span>
              </div>
            </div>
            <div class="form-group row">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">활성:</label>
              <div class="col-md-9 col-sm-9 col-xs-9" style="margin-top:10px;">
                <label class="form-check-label">
                  <input v-model="item.enableF" type="radio" :value="1" />
                  예
                </label>
                <label class="form-check-label">
                  <input v-model="item.enableF" type="radio" :value="0" />
                  아니오
                </label>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" @click="addAction()">저장</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      item: {
        quantity:0,
        purchaseAmount:0,
      },
      actionType: "add",
      listStockAccount: [],
    };
  },
  mounted() {
    this.listAccount();
    $("#addStock").off().on("shown.bs.modal", function() {
      $("#nameField").focus();
    });
  },
  methods: {
    // 등록 폼
    openAddForm(item) {
      this.actionType = "add";
      this.openForm({ ...item, quantity:0, purchaseAmount:0, enableF:1, });
    },
    // 수정 폼
    openEditForm(item) {
      this.actionType = "edit";
      this.openForm(item);
    },
    openForm(item) {
      this.item = $.extend(true, {}, item);
      this.errors.clear();
      $("#addStock").modal();
    },
    listAccount() {
      ElectronUtil.invoke("account/listItem", {}, result => {
        this.listStockAccount = result.filter(r=>r.stockF);
      });
    },
    // 등록 또는 수정
    addAction() {
      this.$validator.validateAll().then(result => {
        if (!result) {
          return;
        }
        if (this.actionType == "add") {
          ElectronUtil.invoke("stock/addItem", this.item, () => {
            $("#addStock").modal("hide");
            this.$parent.$refs.pageList.list();
          });
        } else {
          ElectronUtil.invoke("stock/editItem", this.item, () => {
            $("#addStock").modal("hide");
            this.$parent.$refs.pageList.list();
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.form-control {
  margin: 3px 0 !important;
}
</style>