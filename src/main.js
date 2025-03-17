import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import { createPinia } from 'pinia';
import ToastNotification from './components/ToastNotification.vue';
import VueApexCharts from 'vue3-apexcharts';

const app = createApp(App)
const pinia = createPinia()

app.use(vuetify)
app.use(router)
app.use(pinia)
app.use(VueApexCharts)

app.component('ToastNotification', ToastNotification)

app.mount('#app')
