import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
const routes = setupLayouts(generatedRoutes)
import App from './App.vue'
import './assets/styles.css'
import 'vue-toast-notification/dist/theme-sugar.css'
import ToastPlugin from 'vue-toast-notification'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import SecureLS from "secure-ls";
import VueSweetalert2 from 'vue-sweetalert2';
import './assets/sweetalert2.min.css';
//import VueCountdown from '@chenfengyuan/vue-countdown';

import axios from 'axios'
axios.defaults.baseURL = 'https://api-task.cyclic.app/'

const ls = new SecureLS({
  encodingType: 'aes',
  isCompression: true,
})

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const pinia = createPinia()
pinia.use(createPersistedState({
  storage: {
    getItem: (key) => {
      return ls.get(key)
    },
    setItem: (key, value) => {
      ls.set(key, value)
    }
  }
}))
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(ToastPlugin)
app.use(pinia)
//app.component(VueCountdown.name, VueCountdown);

app.use(VueSweetalert2)
app.use(router)
app.mount('#app')