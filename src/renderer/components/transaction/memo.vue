<template>
  <div id="addMemo" class="modal fade" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">메모 {{actionType == 'add' ? '등록' : '수정'}}</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <form class="form-horizontal">
            <div class="col-md-12 col-sm-12 col-xs-12">
              <div class="form-group">
                <label class="control-label col-md-2 col-sm-2 col-xs-2">메모:</label>
                <div class="col-md-10 col-sm-10 col-xs-10">
                  <textarea id="noteField" class="form-control" name="note" v-model="item.note" v-validate="'required|max:500'" data-vv-as="메모 "></textarea>
                  <div v-if="errors.has('note')">
                    <span class="error">{{errors.first('note')}}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" @click="addAction()">저장</button>
          <button type="button" class="btn btn-warning" @click="deleteAction(item.memoSeq)" v-show="actionType == 'edit'">삭제</button>
          <button type="button" class="btn btn-default" @click="close()">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

export default {
  data() {
    return {
      item: { note: "", },
      actionType: "add",
      selectDate: null,
    };
  },
  computed: {},
  methods: {
    // 등록 폼
    openAddForm(date) {
      this.item = {};
      this.actionType = "add";
      this.item.memoDate = date.format("YYYY-MM-DD");
      this.openForm();
    },
    // 수정 폼
    openEditForm(memo) {
      this.actionType = "edit";
      this.item = memo;
      this.openForm();
    },
    openForm() {
      $("#addMemo").off().on("shown.bs.modal", () => {
        $("#noteField").focus();
      });

      $("#addMemo").modal();
    },
    close() {
      $("#addMemo").modal("hide");
    },
    addAction() {
      this.$validator.validateAll().then(result => {
        if (!result) {
          return;
        }

        let action = this.actionType == "add" ? "memo/addItem" : "memo/editItem";
        ElectronUtil.invoke(action, this.item, result => {
          $("#addMemo").modal("hide");
          this.$parent.reload();
        });
      });
    },
    // 삭제
    deleteAction(memoSeq) {
      if (!confirm("삭제?")) {
        return;
      }
      ElectronUtil.invoke("memo/deleteItem", memoSeq, result => {
        $("#addMemo").modal("hide");
        this.$parent.reload();
      });
    },
  },
  mounted() { },
  created() {
  },
};
</script>
