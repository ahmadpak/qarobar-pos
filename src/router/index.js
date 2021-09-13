import Vue from 'vue'
import VueRouter from 'vue-router'
import config from '../electronStoreConfig'
// Views
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import SetupWizard from '../views/SetupWizard.vue'
import Configuration from '../views/Configuration.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'startup',
    component: function () {
      const dbFilePath = config.get('dbFilePath')
      if (dbFilePath) {
        return import('../views/Home.vue')
      } else {
        return import('../views/SetupWizard.vue')
      }
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/setup-wizard',
    name: 'setupWizard',
    component: SetupWizard
  },
  {
    path: '/configuration',
    name: 'configuration',
    component: Configuration
  }
]

const router = new VueRouter({
  routes
})

export default router
