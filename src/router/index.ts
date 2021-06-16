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
    path: '/ittyping',
    name: 'ItTyping',
    component: () => import('../views/ItTyping.vue')
  },
  {
    path: '/muscletyping',
    name: 'MuscleTyping',
    component: () => import('../views/MuscleTyping.vue')
  },
  {
    path: '/greatemantyping',
    name: 'GreatManTyping',
    component: () => import('../views/GreatManTyping.vue')
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('../views/Result.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
