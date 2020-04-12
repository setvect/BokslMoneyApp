<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: 'my-project',
  mounted() {
    const pageMapping = {
      calendar: "transaction-calendar",
      grid: "transaction-grid",
    };
    ipcRenderer.on("movePage", (event, page) => {
      console.log("this.$route.name :", this.$route.name);
      console.log("##########!# page = ", page);

      let pageName = pageMapping[page];
      if (pageName != null && this.$route.name != pageName) {
        console.log("###############@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        this.$router.push({ name: pageName });
      }
    });
  },
}
</script>

<style>
  /* CSS */
</style>
