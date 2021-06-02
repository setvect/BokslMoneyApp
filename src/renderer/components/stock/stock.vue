<template>
  <div v-cloak>
    <div class="page-title">
      <div class="title_left" style="margin-bottom: 15px">
        <h3>매수종목</h3>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div>
            <div class="form-row">
              <div class="form-group col-md-3">
                <label for="inputCity">매수 총합</label>
                <span class="form-control text-right">{{ sumPurchaseAmount | numberFormat }}</span>
              </div>
              <div class="form-group col-md-3">
                <label for="inputCity">필터링</label>
                <b-form-checkbox v-model="enableFilter">활성 종목만 </b-form-checkbox>
              </div>
            </div>

            <table ref="dataTable" class="table table-striped jambo_table bulk_action table-bordered" id="grid">
              <thead>
                <tr class="headings">
                  <th>종목</th>
                  <th>연결계좌</th>
                  <th>종류</th>
                  <th>상장국가</th>
                  <th>매수금액</th>
                  <th>수량</th>
                  <th>평단가</th>
                  <th>종목상세</th>
                  <th>메모</th>
                  <th>활성</th>
                  <th>기능</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in stockFilterList" :key="idx">
                  <td>{{ item.name }}</td>
                  <td>{{ item.accountSeq | accountName }}</td>
                  <td>{{ item.typeName }}</td>
                  <td>{{ item.nationName }}</td>
                  <td class="text-right">{{ item.purchaseAmount | numberFormat }}</td>
                  <td class="text-right">{{ item.quantity | numberFormat }}</td>
                  <td class="text-right">{{ rating(item) | numberFormat }}</td>
                  <td>
                    <a v-if="item.link" @click="openBrowser(item.link)" style="cursor: pointer" target="_blank">링크</a>
                  </td>
                  <td>{{ item.note }}</td>
                  <td class="text-center">{{ item.enableF ? "예" : "아니오" }}</td>
                  <td class="text-center">
                    <div class="btn-group btn-group-xs">
                      <button type="button" class="btn btn-success btn-sm" @click="openEditForm(item)">수정</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="margin-top: 10px">
              <button type="button" class="btn btn-success" style="margin: 0; float: right" @click="exportExcel()">
                내보내기(엑셀)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <stock ref="stockAdd" @close="reload" />
    </div>
  </div>
</template>
<script type="text/javascript">
import { mapGetters } from "vuex";
import stockComponent from "../account/stockAdd.vue";
import _ from "lodash";

// vue 객체 생성
export default {
  data: function() {
    return {
      enableFilter: true,
    };
  },
  components: {
    stock: stockComponent,
  },
  computed: {
    ...mapGetters(["stockList"]),
    sumPurchaseAmount() {
      return _.sumBy(this.stockList, "purchaseAmount");
    },
    stockFilterList() {
      if (this.enableFilter) {
        return this.stockList.filter((s) => s.enableF);
      }
      return this.stockList;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    // 거래내역 조회
    init() {
      this.$nextTick(() => {
        this.gridTable = $("#grid").DataTable({
          paging: false,
          bInfo: false,
          searching: false,
          dom: "Bfrtip",
          buttons: [
            {
              extend: "excelHtml5",
              title: "복슬머니 계좌목록",
              customize: function(xlsx) {
                var sheet = xlsx.xl.worksheets["sheet1.xml"];
                $("row c", sheet).attr("s", "25");
              },
            }
          ],
        });
        // 엑셀 다운로드 button 감추기
        $(".buttons-excel").hide();
      });
    },
    openEditForm(item) {
      this.$refs.stockAdd.openEditForm(item);
    },
    reload() {
      // 주식 매수 정보 다시 불러옴
      this.loadBasicInfo(() => {});
    },
    // 엑셀 다운로드
    exportExcel() {
      let html = this.$refs.dataTable;
      const htmlText = CommonUtil.replaceAll(html.outerHTML, "<table", "<table border='1'");
      CommonUtil.download(htmlText, "매수종목.xls", "text/html;encoding:utf-8");
    },
  },
};
</script>