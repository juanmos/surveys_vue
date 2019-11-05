import '@babel/polyfill'
import Vue from 'vue'
import VueParticles from 'vue-particles'
import * as VueGoogleMaps from 'vue2-google-maps'
import './plugins/vuetify'

import App from './App.vue'
import router from './router'
import store from './store'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import boost from 'highcharts/modules/boost'
// import { createProvider } from './vue-apollo'
Vue.use(VueParticles)
Vue.use(HighchartsVue)
boost(Highcharts)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDy_B9Hr_yJ2hgWKsuTA1WBd2owjTa2cbA',
    libraries: 'drawing,places' // This is required if you use the Autocomplete plugin
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  // apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
