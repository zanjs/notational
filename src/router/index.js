import Vue from 'vue'
import VueHead from 'vue-head'
import VueRouter from 'vue-router'
import ls from 'local-storage'

import Home from '../pages/Home.vue'
import NotFound from '../pages/NotFound.vue'
import LogIn from '../pages/auth/LogIn.vue'
import SignUp from '../pages/auth/SignUp.vue'
import NV from '../pages/app/NV.vue'
import Public from '../pages/app/Public.vue'

Vue.use(VueHead)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/app', name: 'app', component: NV, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LogIn },
    { path: '/signup', name: 'signup', component: SignUp },
    { path: '/n/:id', name: 'public', component: Public },
    { path: '*', name: 'notfound', component: NotFound }
  ]
})

router.beforeEach((to, from, next) => {
  const user = ls.get('user')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (user) {
      next()
    } else {
      next({ name: 'login', query: { redirect: to.fullPath } })
    }
  } else {
    if (user && to.name !== 'public') {
      next({ name: 'app' })
    } else {
      next()
    }
  }
})

export default router
