<template>
  <div id="app">
    <router-view></router-view>
    <user-edit ref="userEdit"/>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import userEdit from "./components/user/loginUserEdit.vue";
export default {
  name: "my-project",
  components:{
    userEdit,
  },
  mounted() {
    const pageMapping = {
      calendar: "transaction-calendar",
      grid: "transaction-grid",
      settlement: "settlement",
      stat: "stat",
      category: "category",
      account: "account",
      code: "code",
    };
    ipcRenderer.on("movePage", (event, page, query) => {
      let pageName = pageMapping[page];
      if (pageName != null && this.$route.name != pageName) {
        this.$router.push({ name: pageName, query: query, });
      }
    });
    ipcRenderer.on("changePassword", (event, page, query) => {
      this.$refs.userEdit.openForm();
    });
  },
};
</script>

<style>
  /* CSS */
</style>

