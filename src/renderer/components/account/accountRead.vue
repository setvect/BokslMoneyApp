<template>
  <div id="readItem" class="modal fade" role="dialog">
    <div class="modal-dialog modal-lg">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">내용 보기</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <table class="table table-bordered">
            <colgroup>
              <col style="width: 100px;" />
              <col style="width: 35%" />
              <col style="width: 100px;" />
              <col style="width: 35%" />
            </colgroup>
            <tbody>
              <tr>
                <th scope="row">이름</th>
                <td>{{item.name}}</td>
                <th scope="row">계좌(카드)번호</th>
                <td>{{item.accountNumber}}</td>
              </tr>
              <tr>
                <th scope="row">자산종류</th>
                <td>
                  {{item.kindName}}
                </td>
                <th scope="row">계좌성격</th>
                <td>
                  {{item.accountTypeName}}
                </td>
              </tr>
              <tr>
                <th scope="row">잔고</th>
                <td>{{item.balance | numberFormat}}</td>
                <th scope="row">주식매입가</th>
                <td>{{sumStock(item.accountSeq) | numberFormat}}</td>
              </tr>
              <tr>
                <th scope="row">이율</th>
                <td>{{item.interestRate}}</td>
                <th scope="row">계약기간</th>
                <td>{{item.term}}</td>
              </tr>
              <tr>
                <th scope="row">만기일</th>
                <td>{{item.expDate}}</td>
                <th scope="row">월 납입액</th>
                <td>{{item.monthlyPay}}</td>
              </tr>
              <tr>
                <th scope="row">이체일</th>
                <td>{{item.transferDate}}</td>
                <th scope="row">메모 내용</th>
                <td>
                  <span v-br="item.note" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" @click="openEditForm(item)">수정</button>
          <button type="button" class="btn btn-info" @click="deleteAction(item.accountSeq)">삭제</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import "../../common/vue-common.js";
import accountMixin from "./account-mixin.js";

export default {
  data() {
    return {
      item: {},
    };
  },
  mixins: [accountMixin],
  methods: {
    openReadForm(item) {
      this.item = $.extend(true, {}, item);
      $("#readItem").modal();
    },
    openEditForm(item) {
      $("#readItem").modal("hide");
      this.$parent.$refs.popupAdd.openEditForm(item);
    },
    // 삭제
    deleteAction(itemSeq) {
      if (!confirm("삭제?")) {
        return;
      }
      ElectronUtil.invoke("account/deleteItem", itemSeq, () => {
        $("#readItem").modal("hide");
        this.$parent.$refs.pageList.list();
      });
    },
  },
  mounted() { },
};
</script>

<style>
</style>
