import Vue from 'vue'
import App from './App.vue'
import APlayer from '@moefe/vue-aplayer'

Vue.use(APlayer)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
