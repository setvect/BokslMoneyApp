<template>
  <div v-cloak>
    <div class="page-title">
      <div class="title_left" style="margin-bottom: 15px">
        <h3>자산 스냡샷</h3>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div>
            <table ref="dataTable" class="table table-striped jambo_table bulk_action table-bordered" id="grid">
              <thead>
                <tr class="headings">
                  <th>설명</th>
                  <th>합산자산(원)</th>
                  <th>평가자산(원)</th>
                  <th>수익금(원)</th>
                  <th>수익률(%)</th>
                  <th>날짜</th>
                  <th>기능</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in snapshotList" :key="idx">
                  <td>
                    <a @click="openSnapshot(item)" href="javascript:void(0)">{{ item.note }}</a>
                  </td>
                  <td class="text-right">{{ item.totalAmount | numberFormat }}</td>
                  <td class="text-right">{{ item.evaluateAmount | numberFormat }}</td>
                  <td class="text-right" :style="{ color: getGainsColor(item.evaluateAmount - item.totalAmount) }">
                    {{ (item.evaluateAmount - item.totalAmount) | numberFormat }}
                  </td>
                  <td class="text-right" :style="{ color: getGainsColor(item.evaluateAmount - item.totalAmount) }">
                    {{ (((item.evaluateAmount - item.totalAmount) / item.totalAmount) * 100).toFixed(1) }}
                  </td>
                  <td class="text-center">{{ item.regDate | dateFormat("YYYY.MM.DD") }}</td>
                  <td class="text-center">
                    <div class="btn-group btn-group-xs">
                      <button type="button" class="btn btn-success btn-sm" @click="editForm(item)">수정</button>
                      <button type="button" class="btn btn-dark btn-sm" @click="deleteAction(item)">삭제</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="margin-top: 10px">
              <button type="button" class="btn btn-success" @click="addForm()">추가</button>
              <button type="button" class="btn btn-success" style="margin: 0; float: right" @click="exportExcel()">
                내보내기(엑셀)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <snapshotAdd ref="snapshotAdd" @close="list"></snapshotAdd>
    <snapshotRead ref="snapshotRead" @close="list"></snapshotRead>
  </div>
</template>
<script type="text/javascript">
import snapshotAdd from "./snapshotAdd.vue";
import snapshotRead from "./snapshotRead.vue";

// vue 객체 생성
export default {
  data: function() {
    return {
      snapshotList: [],
    };
  },
  components: {
    snapshotAdd,
    snapshotRead,
  },
  computed: {},
  mounted() {
    this.list();
  },
  methods: {
    // 등록 폼
    addForm() {
      this.$refs.snapshotAdd.openAddForm({});
    },
    editForm(item) {
      this.$refs.snapshotAdd.openEditForm(item);
    },
    openSnapshot(item) {
      this.$refs.snapshotRead.open(item.snapshotSeq);
    },
    list() {
      ElectronUtil.invoke("snapshot/listItem", {}, (result) => {
        this.snapshotList = result;
      });
    },
    deleteAction(item) {
      if (!confirm("삭제?")) {
        return;
      }
      ElectronUtil.invoke("snapshot/deleteItem", item.snapshotSeq, () => {
        this.list();
      });
    },
    exportExcel() {
      let html = this.$refs.dataTable;
      const htmlText = CommonUtil.replaceAll(html.outerHTML, "<table", "<table border='1'");
      CommonUtil.download(htmlText, "스냅샷.xls", "text/html;encoding:utf-8");
    },
  },
};
</script>