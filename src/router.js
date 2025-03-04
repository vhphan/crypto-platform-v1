import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import About from './components/About.vue'
import AssetDetail from './components/AssetDetail.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/asset/:id', component: AssetDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
