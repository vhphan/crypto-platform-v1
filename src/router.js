import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import About from './pages/About.vue';
import AssetDetail from './pages/AssetDetail.vue';
import MultipleCharts from "@/pages/MultipleCharts.vue";


const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/multiple', component: MultipleCharts },
  { path: '/asset/:id', component: AssetDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
