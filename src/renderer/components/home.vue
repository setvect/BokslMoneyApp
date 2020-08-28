<template>
  <div class="main_container">
    <div class="col-md-3 left_col">
      <left-menu />
    </div>
    <div class="right_col" role="main">
      <div id="app">
        <router-view></router-view>
        <user-edit ref="userEdit" />
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, remote } from "electron";
import { FindInPage } from "electron-find";
import userEdit from "./user/loginUserEdit.vue";
import leftMenu from "./include/menu.vue";
export default {
  name: "home",
  components:{
    userEdit, leftMenu,
  },
  mounted() {
    ipcRenderer.on("changePassword", (event, page, query) => {
      this.$refs.userEdit.openForm();
    });
    ipcRenderer.on("on-find", (e, args) => {
      let findInPage = new FindInPage(remote.getCurrentWebContents());
      findInPage.openFindWindow();
    });
  },
};
</script>