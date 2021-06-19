import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'firebase/firestore'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

export type VForm = Vue & {
  validate: () => boolean;
  resetValidation: () => boolean;
  reset: () => void;
};