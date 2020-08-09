<template>
  <div>
    <div class="page-title">
      <div class="title_left">
        <h3>계좌 관리</h3>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div>
            <list ref="pageList" />
          </div>
          <div>
            <add ref="popupAdd" />
          </div>
          <div>
            <read ref="popupRead" />
          </div>
          <div>
            <stock ref="stockAdd" />
          </div>
          <div>
            <stock-list ref="stockList" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import listComponent from "./accountList.vue";
import addComponent from "./accountAdd.vue";
import readComponent from "./accountRead.vue";
import stockComponent from "./stockAdd.vue";
import stockListComponent from "./stockList.vue";

export default {
  data() {
    return {
    };
  },
  components: {
    list: listComponent,
    add: addComponent,
    read: readComponent,
    stock: stockComponent,
    stockList: stockListComponent,
  },
  methods: {
  },
  mounted() {
  },
};
</script>