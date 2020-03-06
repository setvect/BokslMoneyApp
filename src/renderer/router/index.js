import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/components/login.vue').default,
    },
    {
      path: '/main',
      name: 'landing-page',
      component: require('@/components/LandingPage.vue').default,
    },
    {
      path: '*',
      redirect: '/',
    }
  ],
})
