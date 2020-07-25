<template>
  <div class="nav-md">
    <div class="container body" style="max-width:100%">
      <div class="main_container">
        <div class="col-md-3 left_col">
          <left-menu />
        </div>
        <top/>
        <!-- page content -->
        <div class="right_col" role="main">
          <!-- Custom Theme Scripts -->
          <div id="app">
            <router-view></router-view>
          </div>
        </div>
        <!-- /page content -->
        아래
      </div>
    </div>
  </div>
</template>

<script>
import leftMenu from "./components/include/menu.vue";
import top from "./components/include/top.vue";

export default {
  name: "bokslMoney",
  components:{
    leftMenu, top,
  },
  mounted() {
  },
};
</script>