<template>
  <div class id="app" v-cloak>
    <div class="page-title">
      <div class="title_left">
        <h3>분류 관리</h3>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div>
            <ul class="nav nav-tabs bar_tabs" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" href="#tab_content1" data-toggle="tab">지출 항목</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#tab_content2" data-toggle="tab">수입 항목</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#tab_content3" data-toggle="tab">이체 항목</a>
              </li>
            </ul>
            <div id="myTabContent" class="tab-content">
              <div role="tabpanel" class="container tab-pane active" id="tab_content1">
                <panel kind="SPENDING" />
              </div>

              <div role="tabpane2" class="container tab-pane fade" id="tab_content2">
                <panel kind="INCOME" />
              </div>

              <div role="tabpane3" class="container tab-pane fade" id="tab_content3">
                <panel kind="TRANSFER" />
              </div>
            </div>
          </div>
          <add />
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import categoryPanel from "./categoryPanel.vue";
import categoryAdd from "./categoryAdd.vue";

export default {
  data() {
    return {
    };
  },
  components: {
    panel: categoryPanel,
    add: categoryAdd,
  },
  methods: {
  },
  mounted() {
  },
};
</script>