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
      let pageName = pageMapping[page];
      if (pageName != null && this.$route.name != pageName) {
        this.$router.push({ name: pageName });
      }
    });
  },
}
</script>

<style>
  /* CSS */
</style>
