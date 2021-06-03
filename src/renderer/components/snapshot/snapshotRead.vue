<template>
  <div id="readItem" class="modal fade" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ item.note }} - {{ item.regDate | dateFormat("YYYY.MM.DD") }}</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body" ref="dataArea">
          <div class="form-group row">
            {{ item.note }}
          </div>
          <div class="form-group row">
            <table class="table table-bordered jambo_table" style="width: 500px">
              <thead>
                <tr class="headings">
                  <th>계좌성격</th>
                  <th>합산금액</th>
                  <th>평가금액</th>
                  <th>비중</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="asset in item.assetGroups" :key="asset.assetGroupSeq">
                  <td>{{ asset.accountTypeName }}</td>
                  <td class="text-right">{{ asset.totalAmount | numberFormat }}</td>
                  <td class="text-right">{{ asset.evaluateAmount | numberFormat }}</td>
                  <td class="text-right">비중</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>합계</th>
                  <th class="text-right">{{ totalAmountSum | numberFormat }}</th>
                  <th class="text-right">{{ evaluateAmountSum | numberFormat }}</th>
                  <th class="text-right">-</th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="form-group row">
            <table class="table table-striped jambo_table bulk_action table-bordered">
              <thead>
                <tr class="headings">
                  <th>종목</th>
                  <th>연결계좌</th>
                  <th>종류</th>
                  <th>상장국가</th>
                  <th>매수금액</th>
                  <th>평가금액</th>
                  <th>매도차익</th>
                  <th>수익률</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in stockEvaluateList" :key="item.stockSeq" style="cursor: pointer">
                  <td>{{ item.name }}</td>
                  <td>{{ item.accountSeq | accountName }}</td>
                  <td>{{ item.typeName }}</td>
                  <td>{{ item.nationName }}</td>
                  <td class="text-right">{{ item.buyAmount | numberFormat }}</td>
                  <td class="text-right">{{ item.evaluateAmount | numberFormat }}</td>
                  <td class="text-right">{{ getRealGains(item) | numberFormat }}</td>
                  <td :style="{ color: getGainsColor(getRealGains(item)) }" class="text-right">
                    {{ calcEarningRate(item) }}%
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="4">합계</th>
                  <th class="text-right">매수금액</th>
                  <th class="text-right">평가금액</th>
                  <th class="text-right">매도차익</th>
                  <th class="text-right">수익률</th>
                </tr>
              </tfoot>
            </table>
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
import snapshotMixin from "./snapshot-mixin.js";
import _ from "lodash";
export default {
  data() {
    return {
      item: {},
      actionType: "add",
      stockEvaluateList: [],
    };
  },
  mixins: [snapshotMixin],
  computed: {
    ...mapGetters(["stockList"]),
    isAddForm() {
      return this.actionType === "add";
    },
    totalAmountSum() {
      return _.sumBy(this.item.assetGroups, "totalAmount");
    },
    evaluateAmountSum() {
      return _.sumBy(this.item.assetGroups, "evaluateAmount");
    },
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
