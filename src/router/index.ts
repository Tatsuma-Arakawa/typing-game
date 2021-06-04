import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/type',
    name: 'Type',
    component: () => import('../views/Type.vue')
  },
  {
    path: '/gamedisplay',
    name: 'GameDispay',
    component: () => import('../views/GameDisplay.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
