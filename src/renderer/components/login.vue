<template>
  <div>
    <div class="login_wrapper">
      <div class="animate form login_form">
        <section class="login_content">
          <b-form>
            <h1>복슬 머니</h1>
            <div>
              <b-form-input v-model="form.password" @keypress.13.prevent="loginProc" v-focus type="password" placeholder="Password"></b-form-input>
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
import "../common/vue-common.js";

export default {
  data() {
    return {
      form: {
        password: "",
      },
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    loginProc() {
      ElectronUtil.invoke("checkLogin", this.form.password, loginSuccess => {
        if (!loginSuccess) {
          Swal.fire(
            "비밀번호 틀렸다.",
            "",
            "warning"
          );
          return;
        }
        this.$router.push({ name: "transaction-calendar", });
      }, { waitMsg: false, });
    },
  },
  mounted() {
    // TODO 로그인 페이지 통과. 향후 아래 코드 제거
    // this.$router.push({ name: "snapshot", });
  },
};
</script>