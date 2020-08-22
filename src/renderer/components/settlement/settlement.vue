<template>
  <div>
    <div class="page-title">
      <div class="title_left">
        <h3>결산</h3>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div>
            <ul class="nav nav-tabs bar_tabs" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" href="#tab_content1" data-toggle="tab">지출/수입/이체</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#tab_content2" data-toggle="tab">주식매매</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane active" style="margin:0 20px;" id="tab_content1">
                <settlement-account/>
              </div>
              <div class="tab-pane fade" style="margin:0 20px;" id="tab_content2">
                <settlement-stock/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import settlementAccountComponent from "./settlementAccount.vue";
import settlementStockComponent from "./settlementStock.vue";

export default {
  name:"settlement",
  data() {
    return {
    };
  },
  components: {
    settlementAccount: settlementAccountComponent,
    settlementStock: settlementStockComponent,
  },
  methods: {
  },
  mounted() {
  },
};
</script>