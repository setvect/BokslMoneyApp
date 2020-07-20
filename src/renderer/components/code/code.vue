<template>
  <div v-cloak>
    <div class="page-title">
      <div class="title_left" style="margin-bottom:15px;">
        <h3>코드관리</h3>
        <select v-model="currentMainCode" @change="list()" class="form-control">
          <option v-for="item in mainCodeList" :value="item.codeMainId" :key="item.codeMainId">{{item.name}}</option>
        </select>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div class="col-md-6 col-sm-8 col-xs-12">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>코드 이름</th>
                  <th>순서</th>
                  <th>편집</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in itemList" :key="item.codeItemSeq">
                  <td>{{item.name}}</td>
                  <td>
                    <a href="javascript:" @click="changeOrder(itemList[index - 1].codeItemSeq, item.codeItemSeq)" :style="{visibility: isUpable(index) ? '' : 'hidden'}">
                      <i class="fa fa-arrow-up"></i>
                    </a>
                    <a href="javascript:" @click="changeOrder(item.codeItemSeq, itemList[index + 1].codeItemSeq)" :style="{visibility: isDownable(index) ? '' : 'hidden'}">
                      <i class="fa fa-arrow-down"></i>
                    </a>
                  </td>
                  <td>
                    <a href="javascript:void(0);" @click="editForm(item)">
                      <i class="fa fa-edit"></i>
                    </a>
                    <a href="javascript:" @click="deleteAction(item.codeItemSeq)">
                      <i class="fa fa-remove"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <button type="button" class="btn btn-success" @click="addForm()">추가</button>
            </div>
          </div>

          <div id="addItem" class="modal fade" role="dialog">
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
                      <input id="nameField" type="text" class="form-control" name="name" v-model="formItem.name" v-validate="'required|max:20'" data-vv-as="이름 " v-on:keyup.13="addAction()" />
                      <span class="error" v-if="errors.has('name')">{{errors.first('name')}}</span>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">

// vue 객체 생성
export default {
  data: function() {
    return {
      item: {},
      currentMainCode: "",
      itemList: [],
      actionType: "",
      codeMain: {},
      formItem: {},
      mainCodeList: [],
    };
  },
  methods: {
    // 리스트
    list() {
      ElectronUtil.invoke("code/listItem", this.currentMainCode, result => {
        this.itemList = result;
      });
    },
    // 메인코드
    loadCodeMain() {
      ElectronUtil.invoke("code/listMain", null, result => {
        this.mainCodeList = result;
      });
    },
    // 등록 폼
    addForm() {
      this.actionType = "add";
      // 목록에서 최대 orderNo + 1 구하기
      let orderNo = this.itemList.reduce((acc, item) => {
        return Math.max(acc, item.orderNo);
      }, 0) + 1;
      this.openForm({ orderNo: orderNo, });
    },
    // 수정 폼
    editForm(item) {
      this.actionType = "edit";
      this.openForm(item);
    },
    openForm(item) {
      this.formItem = $.extend(true, {}, item);

      $("#addItem").modal();
    },
    // 등록 또는 수정
    addAction() {
      this.$validator.validateAll().then(result => {
        if (!result) {
          return;
        }
        this.formItem.codeMainId = this.currentMainCode;
        if (this.actionType == "add") {
          ElectronUtil.invoke("code/addItem", this.formItem, () => {
            $("#addItem").modal("hide");
            this.list();
          });
        } else {
          ElectronUtil.invoke("code/editItem", this.formItem, () => {
            $("#addItem").modal("hide");
            this.list();
          });
        }
      });
    },
    // 정렬 순서 변경
    changeOrder(downCodeItemSeq, upCodeItemSeq) {
      let param = {
        codeMainId: this.currentMainCode,
        downCodeItemSeq: downCodeItemSeq,
        upCodeItemSeq: upCodeItemSeq,
      };

      ElectronUtil.invoke("code/changeOrder", param, () => {
        this.list();
      });
    },
    // 삭제
    deleteAction(codeItemSeq) {
      if (!confirm("삭제?")) {
        return;
      }
      let param = { codeMainId: this.currentMainCode, codeItemSeq: codeItemSeq, };
      ElectronUtil.invoke("code/deleteItem", param, () => {
        this.list();
      });
    },
    isUpable(index) {
      if (this.itemList.length <= 1) {
        return false;
      }
      return index !== 0;
    },
    isDownable(index) {
      if (this.itemList.length <= 1) {
        return false;
      }
      return index + 1 !== this.itemList.length;
    },
  },
  created() {
    let url = new URL(location.href);
    this.currentMainCode = url.searchParams.get("currentMainCode");
  },
  mounted() {
    $("#addItem").off().on("shown.bs.modal", function() {
      $("#nameField").focus();
    });
    this.currentMainCode = this.$route.query.mainCode;
    this.loadCodeMain();
    this.list();
  },
};
</script>