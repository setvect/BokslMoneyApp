<template>
  <div id="itemAllList" class="modal" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">항목 선택</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <form class="form-horizontal">
            <div class="col-md-6 col-sm-6 col-xs-6">
              <p>대분류</p>
              <select class="form-control _mainItemSelect" size="10" v-model="selectMainItem" @change="reset()">
                <option v-for="(item) in mainList" :value="item" :key="item.categorySeq">{{item.name}}</option>
              </select>
            </div>
            <div class="col-md-6 col-sm-6 col-xs-6">
              <p>소분류</p>
              <select class="form-control _subItemSelect" size="10" v-model="selectSubItem">
                <option v-for="(item) in selectMainItem.children" :value="item" :key="item.categorySeq">{{item.name}}</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" @click="confirm()">저장</button>
          <button type="button" class="btn btn-default" @click="close()">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import ElectronUtil from "../../common/electron-util";
import _ from "lodash";

export default {
  data() {
    return {
      itemListMap: {},
      mainList: [],
      selectMainItem: {},
      selectSubItem: null,
      callBack: null,
    };
  },
  methods: {
    // 확인
    confirm() {
      if (!this.selectSubItem) {
        alert("소분류 항목 선택해 주세요.");
        return;
      }
      this.callBack(this.selectMainItem, this.selectSubItem);
      $("#itemAllList").modal("hide");
    },
    // 항목 조회
    loadItemAllList() {
      let param = { };
      // 전체 데이터 불러와 계층적으로 구성
      ElectronUtil.invoke("category/list", param, result => {
        const categoryMap = _.groupBy(result, "kind");
        for(const key in categoryMap) {
          let list = categoryMap[key];
          categoryMap[key] = this.findChildren(list, (element)=> element.parentSeq === 0);
        }
        this.itemListMap = categoryMap;
      });
    },
    reset() {
      this.selectSubItem = null;
      $("._subItemSelect option:eq(0)").prop("selected", true);
      this.selectSubItem = this.selectMainItem.children[0];
    },
    // item: 유형(이체, 지출, 수입)
    // callBack: 부모 모달 종류(add, often)
    openCategoryList(itemType, callBack) {
      console.log("itemType :>> ", itemType);
      console.log("callBack :>> ", callBack);

      this.mainList = this.itemListMap[itemType];
      this.callBack = callBack;
      $("#itemAllList").modal();
      // DOM 갱신 이후 발생한 이벤트
      this.$nextTick(() => {
        let selectIdx = $("._mainItemSelect").prop("selectedIndex");
        if (selectIdx == -1) {
          $("._mainItemSelect option:eq(0)").prop("selected", true);
          this.selectMainItem = this.mainList[0];
          this.reset();
        }
      });
    },
    // 분류의 자식 로드 찾기
    findChildren(list, findCondition) {
      let currentDepthItems = list.filter(v => findCondition(v));
      currentDepthItems.forEach(v=>{
        const myChildren = this.findChildren(list, (element)=> element.parentSeq === v.categorySeq);
        v["children"] = myChildren;
      });
      return currentDepthItems;
    },
  },
  mounted() {
    this.loadItemAllList();
  },
};
</script>