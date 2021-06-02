<template>
  <div class="left_col scroll-view">
    <div class="navbar nav_title" style="border: 0; padding:0">
      <router-link :to="{name: 'transaction-calendar'}" class="site_title">
        <i class="fa fa-paw"></i>
        <span>복슬머니</span>
      </router-link>
    </div>
    <div class="clearfix"></div>
    <!-- sidebar menu -->
    <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
      <div class="menu_section">
        <ul class="nav side-menu">
          <li :class="{'active': currentName == 'transaction-calendar'}">
            <router-link :to="{name: 'transaction-calendar'}">
              <i class="fa fa-calendar"></i> 가계부 쓰기(달력)
            </router-link>
          </li>
          <li :class="{'active': currentName == 'transaction-grid'}">
            <router-link :to="{name: 'transaction-grid'}">
              <i class="fa fa-th"></i> 가계부 쓰기(표)
            </router-link>
          </li>
          <li :class="{'active': currentName == 'transaction-stock'}">
            <router-link :to="{name: 'transaction-stock'}">
              <i class="fa fa-credit-card"></i> 주식 매매
            </router-link>
          </li>
          <li :class="{'active': currentName == 'settlement'}">
            <router-link :to="{name: 'settlement'}">
              <i class="fa fa-database"></i> 결산
            </router-link>
          </li>
          <li :class="{'active': currentName == 'stat'}">
            <router-link :to="{name: 'stat'}">
              <i class="fa fa-bar-chart-o"></i> 통계
            </router-link>
          </li>
          <li :class="{'active': currentName == 'category'}">
            <router-link :to="{name: 'category'}">
              <i class="fa fa-building-o"></i> 분류 관리
            </router-link>
          </li>
          <li :class="{'active': currentName == 'account'}">
            <router-link :to="{name: 'account'}">
              <i class="fa fa-money"></i> 계좌 관리
            </router-link>
          </li>
          <li :class="{'active': currentName == 'stock'}">
            <router-link :to="{name: 'stock'}">
              <i class="fa fa-line-chart"></i> 매수 종목
            </router-link>
          </li>
          <li :class="{'active': currentName == 'code'}">
            <router-link :to="{name: 'code'}">
              <i class="fa fa-book"></i> 코드 관리
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <!-- /sidebar menu -->
  </div>
</template>
<script>
export default {
  name: "left-menu",
  data() {
    return {
    };
  },
  computed:{
    currentName() {
      return this.$route.name;
    },
  },
  mounted() {
  },
  methods: {
  },
};

</script>
<style scoped>
li {
  width: 100%;
  margin-bottom: 6px;
}
.nav.side-menu > li > a {
  margin-bottom: 0;
}
</style>