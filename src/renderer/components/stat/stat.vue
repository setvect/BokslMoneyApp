<template>
  <div id="app">
    <div class="page-title">
      <div class="title_left">
        <h3>통계</h3>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div>
            <ul class="nav nav-tabs bar_tabs" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" href="#tab_content1" data-toggle="tab">수입/지출/이체</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#tab_content2" data-toggle="tab">자산 변동</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="container tab-pane active" id="tab_content1">
                <kind-group />
              </div>
              <div class="container tab-pane fade" id="tab_content2">
                <stat-assets />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import kindGroupComponent from "./statKindGroup.vue";
import assetsComponent from "./statAssets.vue";

export default {
  data() {
    return {
    };
  },
  components: {
    kindGroup: kindGroupComponent,
    statAssets: assetsComponent,
  },
  methods: {
  },
  mounted() {
  },
};
</script>