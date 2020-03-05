<template>
  <div>
    <div class="login_wrapper">
      <div class="animate form login_form">
        <section class="login_content">
          <b-form>
            <h1>복슬 머니</h1>
            <div>
              <b-form-input ref="password" type="password" v-model="form.password" placeholder="Password" @keypress.13.prevent="loginProc"></b-form-input>
            </div>
            <div style="padding-top: 20px;">
              <b-button @click.prevent="loginProc" variant="outline-secondary">Login</b-button>
            </div>
            <div class="clearfix"></div>
          </b-form>
        </section>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data () {
    return {
      form: {
        password: '',
      },
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  beforeCreate () {
    document.body.className = 'login'
  },
  methods: {
    loginProc () {
      console.log('process :', process)
      // Swal.fire('로그인 실패', '아이디 또는 비밀번호가 틀렸다.', 'error')
      // renderer 프로세스(웹 페이지)안에서
      const { ipcRenderer, } = require('electron')
      ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log('asynchronous111', arg) // "pong"이 출력됩니다.
      })
      ipcRenderer.send('asynchronous-message', this.form.password)
    },
  },
  mounted () {
    this.$refs.password.$el.focus()
  },
}
</script>