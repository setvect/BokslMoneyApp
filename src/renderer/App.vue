<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: "my-project",
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
  },
};
</script>

<style>
  /* CSS */
</style>

