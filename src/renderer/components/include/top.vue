<template>
  <div class="top_nav">
    <div class="nav_menu">
      <nav>
        <div class="nav toggle">
          <a id="menu_toggle">
            <i class="fa fa-bars"></i>
          </a>
        </div>
        <ul class="nav navbar-nav navbar-right" style="display:block">
          <li class="dropdown">
            <a @click="changePassword()" href="javascript:void(0)" style="margin-right:20px;">
              비밀번호 변경
              <i class="fa fa-edit"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <user-edit ref="userEdit" />
  </div>
</template>

<script>
import userEdit from "../user/loginUserEdit.vue";

export default {
  name: "top",
  data() {
    return {
    };
  },
  components:{
    userEdit,
  },
  computed:{
    currentName() {
      return this.$route.name;
    },
  },
  mounted() {
  },
  methods: {
    changePassword() {
      this.$refs.userEdit.openForm();
    },
  },
};
</script>