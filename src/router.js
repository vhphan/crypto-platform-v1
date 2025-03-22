import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import About from './pages/About.vue';
import AssetDetail from './pages/AssetDetail.vue';
import MultipleCharts from "@/pages/MultipleCharts.vue";
import ExampleLWChart from "../frontend/components/ExampleLWChart.vue";


const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/multiple', component: MultipleCharts },
  { path: '/example', component: ExampleLWChart },
  { path: '/asset/:id', component: AssetDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
