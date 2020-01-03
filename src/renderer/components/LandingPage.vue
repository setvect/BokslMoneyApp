<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue" />
    <main>
      <div class="left-side">
        <span class="title">안녕 복슬이111...</span>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'landing-page',
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },
  },
}
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 30px 30px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }
</style>
