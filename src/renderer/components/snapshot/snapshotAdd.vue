<template>
  <div id="addItem" class="modal fade" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ actionType == "add" ? "등록" : "수정" }}</h5>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <form class="form-horizontal">
            <div class="form-group row">
              <label class="control-label col-md-3 col-sm-3 col-xs-3">설명:</label>
              <div class="col-md-9 col-sm-9 col-xs-9">
                <input
                  type="text"
                  id="noteField"
                  class="form-control"
                  name="note"
                  v-model="item.note"
                  v-validate="'required|max:100'"
                  data-vv-as="설명 "
                />
                <span class="error" v-if="errors.has('note')">{{ errors.first("note") }}</span>
              </div>
            </div>
            <div class="form-group row">
              <table class="table table-striped jambo_table bulk_action table-bordered" id="stockGrid">
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
                  <tr v-for="(item, idx) in stockEvaluateList" :key="item.stockSeq" style="cursor: pointer">
                    <td>{{ item.name }}</td>
                    <td>{{ item.accountSeq | accountName }}</td>
                    <td>{{ item.typeName }}</td>
                    <td>{{ item.nationName }}</td>
                    <td class="text-right">{{ item.buyAmount | numberFormat }}</td>
                    <td>
                      <my-currency-input
                        v-model="item.evaluateAmount"
                        class="form-control"
                        :name="'money' + idx"
                        maxlength="10"
                        v-validate="'required'"
                        data-vv-as="합산금액 "
                      ></my-currency-input>
                      <span class="error" v-if="errors.has('money' + idx)">{{ errors.first("money" + idx) }}</span>
                    </td>
                    <td class="text-right">{{ getRealGains(item) | numberFormat }}</td>
                    <td :style="{ color: getGainsColor(getRealGains(item)) }" class="text-right">
                      {{ calcEarningRate(item) }}%
                    </td>
                  </tr>
                </tbody>
              </table>
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
import { mapGetters } from "vuex";
import snapshotMixin from "./snapshot-mixin.js";
import _ from "lodash";

export default {
  data() {
    return {
      item: {},
      actionType: "add",
      stockEvaluateList: [],
      gridTable: null,
    };
  },
  mixins: [snapshotMixin],
  computed: {
    ...mapGetters(["stockList"]),
    isAddForm() {
      return this.actionType === "add";
    },
  },
  mounted() {
    $("#addItem")
      .off()
      .on("shown.bs.modal", function() {
        $("#noteField").focus();
      });
  },
  methods: {
    // 등록 폼
    openAddForm(item) {
      this.actionType = "add";
      this.openForm(item);
    },
    // 수정 폼
    openEditForm(item) {
      this.actionType = "edit";
      this.openForm(item);
    },
    openForm(item) {
      this.loadBasicInfo(() => this.loadStock());
      this.item = $.extend(true, {}, item);

      $("#addItem").modal();
    },
    loadStock() {
      if (this.isAddForm) {
        // 현재 주식종목을 기준으로 등록
        this.stockEvaluateList = this.stockList
          .filter((s) => s.enableF)
          .map((s) => {
            return {
              name: s.name,
              stockSeq: s.stockSeq,
              accountSeq: s.accountSeq,
              typeName: s.typeName,
              nationName: s.nationName,
              buyAmount: s.purchaseAmount,
              evaluateAmount: s.purchaseAmount,
            };
          });
      } else {
        // 등록 당시 입력했던 주식을 기준으로 조회
        ElectronUtil.invoke("snapshot/getItem", this.item.snapshotSeq, (snapshot) => {
          this.item = snapshot;
          const stockMap = _.chain(this.stockList).keyBy("stockSeq").value();
          this.stockEvaluateList = snapshot.stockEvaluates.map((s) => {
            return {
              ...stockMap[s.stockSeq],
              buyAmount: s.buyAmount,
              evaluateAmount: s.evaluateAmount,
            };
          });
          this.initGrid();
        });
      }
    },
    // 등록 또는 수정
    addAction() {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }
        this.item.stockEvaluateList = this.stockEvaluateList;
        if (this.actionType == "add") {
          ElectronUtil.invoke("snapshot/addItem", this.item, () => {
            $("#addItem").modal("hide");
            this.$emit("close");
          });
        } else {
          ElectronUtil.invoke("snapshot/editItem", this.item, () => {
            $("#addItem").modal("hide");
            this.$emit("close");
          });
        }
      });
    },
    getRealGains(item) {
      return item.evaluateAmount - item.buyAmount;
    },
    // 수익율%
    calcEarningRate(item) {
      const realSellGains = this.getRealGains(item);
      return ((realSellGains / item.buyAmount) * 100).toFixed(1);
    },
    initGrid() {
      this.$nextTick(() => {
        if (this.gridTable != null) {
          this.gridTable.destroy();
        }

        this.gridTable = $("#stockGrid").DataTable({
          paging: false,
          bInfo: false,
          searching: false,
          dom: "Bfrtip",
          buttons: [],
        });
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