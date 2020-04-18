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
      name: 'transaction-calendar',
      component: require('@/components/transaction/calendar.vue').default,
    },
    {
      path: '/grid',
      name: 'transaction-grid',
      component: require('@/components/transaction/grid.vue').default,
    },
    {
      path: '/settlement',
      name: 'settlement',
      component: require('@/components/settlement/settlement.vue').default,
    },
    {
      path: '*',
      redirect: '/',
    }
  ],
})
