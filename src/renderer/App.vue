<template>
  <div class="nav-md">
    <div class="container body" style="max-width:100%">
      <div class="main_container">
        <div class="col-md-3 left_col">
          <left-menu />
        </div>
        <!-- page content -->
        <div class="right_col" role="main">
          <!-- Custom Theme Scripts -->
          <div id="app">
            <router-view></router-view>
            <user-edit ref="userEdit" />
          </div>
        </div>
        <!-- /page content -->
        아래
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import userEdit from "./components/user/loginUserEdit.vue";
import leftMenu from "./components/include/menu.vue";
export default {
  name: "bokslMoney",
  components:{
    userEdit, leftMenu,
  },
  mounted() {
    ipcRenderer.on("changePassword", (event, page, query) => {
      this.$refs.userEdit.openForm();
    });
  },
};
</script>

<style>
/* CSS */
</style>


