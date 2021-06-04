<template>
  <div id="readItem" class="modal fade" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <!-- Modal content-->
      <div class="modal-content" ref="dataArea">
        <div class="modal-header">
          <h5 class="modal-title">{{ item.note }} - {{ item.regDate | dateFormat("YYYY.MM.DD") }}</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body" ref="dataArea">
          <div class="form-group row">계좌 성격별 통계</div>
          <div class="form-group row">
            <snapshotAccountStats :assetGroups="item.assetGroups" />
          </div>
          <div class="form-group row">주식 종류별 통계</div>
          <div class="form-group row">
            <snapshotStockStats :stockEvaluateList="stockEvaluateList" groupField="typeName" />
          </div>
          <div class="form-group row">주식 국가별 통계</div>
          <div class="form-group row">
            <snapshotStockStats :stockEvaluateList="stockEvaluateList" groupField="nationName" />
          </div>
          <div class="form-group row">주식 종목별 성과</div>
          <div class="form-group row">
            <snapshotStockList :stockEvaluateList="stockEvaluateList" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">닫기</button>
          <button type="button" class="btn btn-success" style="margin: 0; float: right" @click="exportExcel()">
            내보내기(엑셀)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from "vuex";
import snapshotStockStats from "./snapshotStockStats.vue";
import snapshotAccountStats from "./snapshotAccountStats.vue";
import snapshotStockList from "./snapshotStockList.vue";
import _ from "lodash";

export default {
  data() {
    return {
      item: {},
      actionType: "add",
      stockEvaluateList: [],
    };
  },
  components: {
    snapshotAccountStats,
    snapshotStockStats,
    snapshotStockList,
  },
  computed: {
    ...mapGetters(["stockList"]),
  },
  mounted() {},
  methods: {
    open(snapshotSeq) {
      this.loadBasicInfo(() => this.loadStock(snapshotSeq));
      $("#readItem").modal();
    },
    loadStock(snapshotSeq) {
      ElectronUtil.invoke("snapshot/getItem", snapshotSeq, (snapshot) => {
        this.item = snapshot;
        const stockMap = _.chain(this.stockList).keyBy("stockSeq").value();
        this.stockEvaluateList = snapshot.stockEvaluates.map((s) => {
          return {
            ...stockMap[s.stockSeq],
            buyAmount: s.buyAmount,
            evaluateAmount: s.evaluateAmount,
          };
        });
      });
    },
    exportExcel() {
      let html = this.$refs.dataArea;
      const htmlText = CommonUtil.replaceAll(html.outerHTML, "<table", "<table border='1'");
      CommonUtil.download(
        htmlText,
        `스냅샷_${CommonUtil.formatDate(this.item.regDate, "YYYY-MM-DD")}.xls`,
        "text/html;encoding:utf-8"
      );
    },
  },
};
</script>
