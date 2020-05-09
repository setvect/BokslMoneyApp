<style scoped>
  .form-control{
    margin: 3px 0 !important;
  }
</style>

<template>
  <div id="addItem" class="modal fade" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{actionType == 'add' ? '등록' : '수정'}}</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">이름:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <input type="text" class="form-control" name="name" v-model="item.name" v-validate="'required|max:20'" data-vv-as="이름 " />
                <span class="error" v-if="errors.has('name')">{{errors.first('name')}}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">계좌(카드)번호:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <input type="text" class="form-control" name="accountNumber" v-model="item.accountNumber" v-validate="'required|max:30'" data-vv-as="계좌(카드)번호 " />
                <span class="error" v-if="errors.has('accountNumber')">{{errors.first('accountNumber')}}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">자산종류:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <select class="form-control" name="kindCode" v-model="item.kindCode" v-validate="'required'" data-vv-as="자산종류 ">
                  <option v-for="kindCode in kindCodeList" v-bind:value="kindCode.codeItemSeq" :key="kindCode.name">{{ kindCode.name }}</option>
                </select>
                <span class="error" v-if="errors.has('kindCode')">{{errors.first('kindCode')}}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">잔고:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <input type="number" class="form-control" name="balance" v-model="item.balance" v-validate="'required|integer|max:11|between:-2000000000,2000000000'" data-vv-as="잔고 " />
                <span class="error" v-if="errors.has('balance')">{{errors.first('balance')}}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">이율:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <input type="text" class="form-control" name="interestRate" v-model="item.interestRate" v-validate="'max:20'" data-vv-as="이율 " />
                <span class="error" v-if="errors.has('interestRate')">{{errors.first('interestRate')}}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">계약기간:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <input type="text" class="form-control" name="term" v-model="item.term" v-validate="'max:20'" data-vv-as="계약기간 " />
                <span class="error" v-if="errors.has('term')">{{errors.first('term')}}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">만기일:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <input type="text" class="form-control" name="expDate" v-model="item.expDate" v-validate="'max:20'" data-vv-as="만기일 " />
                <span class="error" v-if="errors.has('expDate')">{{errors.first('expDate')}}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">월 납입액:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <input type="text" class="form-control" name="monthlyPay" v-model="item.monthlyPay" v-validate="'max:20'" data-vv-as="월 납입액 " />
                <span class="error" v-if="errors.has('monthlyPay')">{{errors.first('monthlyPay')}}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">이체일:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <input type="text" class="form-control" name="transferDate" v-model="item.transferDate" v-validate="'max:20'" data-vv-as="이체일 " />
                <span class="error" v-if="errors.has('transferDate')">{{errors.first('transferDate')}}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">메모 내용:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <textarea class="form-control" name="note" v-model="item.note" v-validate="'max:200'" data-vv-as="메모 내용 "></textarea>
                <span class="error" v-if="errors.has('note')">{{errors.first('note')}}</span>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" @click="addAction()">저장</button>
          <button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import ElectronUtil from "../../common/electron-util";

export default {
  data() {
    return {
      item: {},
      actionType: "add",
      kindCodeList: [],
    };
  },
  methods: {
    // 등록 폼
    addForm(item) {
      this.actionType = "add";
      this.openForm(item);
    },
    //수정 폼
    editForm(item) {
      this.actionType = "edit";
      this.openForm(item);
    },
    openForm(item) {
      this.item = $.extend(true, {}, item);
      $("#addItem").modal();
    },
    // 등록 또는 수정
    addAction() {
      this.$validator.validateAll().then(result => {
        if (!result) {
          return;
        }
        if (this.actionType == "add") {
          ElectronUtil.invoke('account/addItem', this.item, () => {
            $("#addItem").modal("hide");
            this.$EventBus.$emit("listEvent");
          });
        } else {
          ElectronUtil.invoke('account/editItem', this.item, () => {
            $("#addItem").modal("hide");
            this.$EventBus.$emit("listEvent");
          });
        }
      });
    },
    // 자산 코드 읽어 오기
    listKindCode() {
      ElectronUtil.invoke('code/listItem', "KIND_CODE", result => {
        this.kindCodeList = result;
      });
    },
  },
  mounted() {
    this.listKindCode();
  },
  created() {
    this.$EventBus.$on("addFormEvent", this.addForm);
    this.$EventBus.$on("editFormEvent", this.editForm);
  },
};
</script>
