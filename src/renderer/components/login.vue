<template>
  <div>
    <div class="login_wrapper">
      <div class="animate form login_form">
        <section class="login_content">
          <b-form>
            <h1>복슬 머니</h1>
            <div>
              <b-form-input v-model="form.password" @keypress.13.prevent="loginProc" ref="password" type="password" placeholder="Password"></b-form-input>
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
import {ipcRenderer} from 'electron'

export default {
  data() {
    return {
      form: {
        password: '',
      },
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  beforeCreate() {
    document.body.className = 'login'
  },
  methods: {
    loginProc() {
      ipcRenderer.send('loginCheck', this.form.password)
    },
  },
  mounted() {
    this.$refs.password.$el.focus()
    ipcRenderer.on('loginCheckResponse', (event, loginSuccess) => {
      console.log('login-check', loginSuccess)
    })
  },
}
</script>