import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

const messages = {
  es: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: 'Elementos por página:',
        pageText: '{0}-{1} av {2}',
        noResultsText: 'No se encontraron registros coincidentes',
        nextPage: 'Siguiente',
        prevPage: 'Anterior',
        'noDataText': 'Información no disponible',
        dataTable: {
          rowsPerPageText: 'Filas por página:'
        }
      }
    }
  }
}
// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'es', // set locale
  messages // set locale messages
})
Vue.use(Vuetify, {
  theme: {
    primary: '#FA000B'
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
})
