import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from './feathers-client'
const { auth, FeathersVuex, service } = feathersVuex(feathersClient, { idField: '_id' })

Vue.use(Vuex)
Vue.use(FeathersVuex)

export default new Vuex.Store({
  plugins: [
    service('users', {
      instanceDefaults: {
        name: '',
        email: '',
        password: '',
        avatar: '',
        removed: false
      },
      debug: true
    }),
    service('category-poll', {
      instanceDefaults: {
        name: '',
        type: '',
        _contains_codegeneral: false
      },
      debug: true
    }),
    service('codescategorypolls', {
      instanceDefaults: {
        code: '',
        name: '',
        _categorypoll_id: ''
      },
      debug: true
    }),
    service('question-types', {
      instanceDefaults: {
        type_camp: '',
        config: []
      },
      debug: true
    }),
    service('customers', {
      instanceDefaults: {
        code: '',
        count: 2,
        name: '',
        ruc: '',
        economic_group: '',
        address: '',
        email: '',
        phones: '',
        type: '',
        special_ruc: false,
        _city_id: '',
        _type_company_id: '',
        _segment_id: '',
        _representative_user_id: '',
        removed: false
      }
    }),
    service('construct-images', {
      instanceDefaults: {
        name: '',
        filename: '',
        path: '',
        _construct_id: '',
        description: '',
        type: '',
        removed: false
      }
    }),
    service('regions', {
      instanceDefaults: {
        name: '',
        _country_id: ''
      }
    }),
    service('roles', {
      instanceDefaults: {
        code: '',
        name: '',
        description: '',
        permissionrol: []
      }
    }),
    service('permission', {
      instanceDefaults: {
        module: '',
        description: '',
        url: ''
      }
    }),
    service('uploads', {
      instanceDefaults: {
        file: '',
        type: ''
      }
    }),
    service('category-project', {
      instanceDefaults: {
        name: '',
        description: ''
      }
    }),
    service('menu-items', {
      instanceDefaults: {
        name: '',
        icon: '',
        url: ''
      }
    }),
    service('menus', {
      instanceDefaults: {
        level: '',
        order: '',
        _roles_id: '',
        _menu_id: '',
        _menu_item_id: '',
        removed: false
      }
    }),
    service('restfuls', {
      instanceDefaults: {
        name: '',
        url: '',
        description: ''
      }
    }),
    service('users-polls', {
      instanceDefaults: {
        name: '',
        email: '',
        password: '',
        phones: '',
        avatar: '',
        removed: false
      }
    }),
    service('category-segmentation', {
      instanceDefaults: {
        name: '',
        description: '',
        datos: [],
        removed: false
      }
    }),
    service('polls-project', {
      instanceDefaults: {
        name: '',
        date_start: '',
        date_end: '',
        date_deliver: '',
        _customer_id: '',
        _customer_contact_id: '',
        number_polls: '',
        state_polls: [],
        removed: false
      }
    }),
    auth({ userService: 'users' })
  ],
  state: {
    snackMessage: '',
    showSnack: false,
    snackColor: 'success'
  },
  getters: {
    getSnackMessage: (state) => {
      return state.snackMessage
    },
    getShowSnack: (state) => {
      return state.getShowSnack
    },
    getSnackColor: (state) => {
      return state.getSnackColor
    }
  },
  mutations: {
    setSnackMessage (state, message) {
      state.snackMessage = message
    },
    setShowSnack (state, show) {
      state.showSnack = show
    },
    setSnackColor (state, type) {
      state.snackColor = type
    }
  },
  actions: {
    setSnackMessage: ({ commit }, message) => {
      commit('setSnackMessage', message)
    },
    setShowSnack: ({ commit }, show) => {
      commit('setShowSnack', show)
    },
    setSnackColor: ({ commit }, show) => {
      commit('setSnackColor', show)
    }
  }
})
