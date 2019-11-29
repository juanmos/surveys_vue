import '@babel/polyfill'
import Vue from 'vue'
import VueParticles from 'vue-particles'
import * as VueGoogleMaps from 'vue2-google-maps'
import './plugins/vuetify'
import ModalFullScreenVue from 'modal-fullscreen-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import boost from 'highcharts/modules/boost'
// import { createProvider } from './vue-apollo'
import loadExporting from 'highcharts/modules/exporting'
loadExporting(Highcharts)

Highcharts.setOptions({
  colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
    return {
      radialGradient: {
        cx: 0.5,
        cy: 0.3,
        r: 0.7
      },
      stops: [
        [0, color],
        [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
      ]
    }
  })})

Vue.use(ModalFullScreenVue)
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
