<template>
  <div id="addItem" class="modal" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">등록</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <form onsubmit="return false;">
            <div class="form-group">
              <label>이름:</label>
              <input type="text" id="nameField" class="form-control" name="name" v-model="item.name" v-validate="'required|max:20'" data-vv-as="이름 " v-on:keyup.13="addAction()" />
              <!-- <span class="error" v-if="errors.has('name')">{{errors.first('name')}}</span> -->
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
      item: { name: "", },
      afterEventCallback: null,
      actionType: "add",
    };
  },
  methods: {
    // 등록 폼
    openAddForm(item, afterEventCallback) {
      this.actionType = "add";
      this.openForm(item, afterEventCallback);
    },
    // 수정 폼
    openEditForm(item, afterEventCallback) {
      this.actionType = "edit";
      this.openForm(item, afterEventCallback);
    },
    openForm(item, afterEventCallback) {
      this.item = $.extend(true, {}, item);
      this.afterEventCallback = afterEventCallback;
      $("#addItem").modal();
    },
    // 등록 또는 수정
    addAction() {
      this.$validator.validateAll().then(result => {
        if (!result) {
          return;
        }
        if (this.actionType == "add") {
          ElectronUtil.invoke("category/addItem", this.item, () => {
            $("#addItem").modal("hide");
            this.afterEventCallback();
            this.item.name = "";
          });
        } else {
          ElectronUtil.invoke("category/editItem", this.item, () => {
            $("#addItem").modal("hide");
            this.afterEventCallback();
            this.item.name = "";
          });
        }
      });
    },
  },
  mounted() {
    $("#addItem").off().on("shown.bs.modal", function() {
      $("#nameField").focus();
    });
  },
};
</script>