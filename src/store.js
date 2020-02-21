import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from './feathers-client'
import enviroment from './../config/enviroment'
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
    service('derive-questions', {
      instanceDefaults: {
        data: null
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
        services: []
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
        removed: false,
        userPolls: []
      }
    }),
    service('poll-category', {
      instanceDefaults: {
        _polls_project_id: '',
        _categorySegmentation_id: '',
        removed: false
      }
    }),
    service('users-roles', {
      instanceDefaults: {
        _user_id: null,
        _rol_id: null,
        rol: null,
        removed: false
      }
    }),
    service('marker-polls', {
      instanceDefaults: {
        _user_id: null,
        _config_poll_id: null,
        position: null,
        dateStart: null,
        dateEnd: null,
        removed: false
      }
    }),
    service('config-polls', {
      instanceDefaults: {
        name: '',
        construct: '',
        imported: false,
        originalJson: '',
        PollInstances: [],
        formatedConfiguration: '',
        parsedJson: '',
        removed: false,
        _polls_project_id: 0,
        dateCreated: '',
        dashboardSaved: '',
        dashboardRows: 1
      }
    }),
    service('poll-instances', {
      instanceDefaults: {
        removed: false,
        _config_poll_id: 0
      }
    }),
    service('web-survey-results', {
      instanceDefaults: {
        fecha_inicio: '',
        fecha_fin: '',
        answers: {},
        _user_id: '',
        _config_poll_id: ''
      }
    }),
    service('users-projects', {
      instanceDefaults: {
        _user_id: null,
        _project_id: null,
        removed: false
      }
    }),
    service('category-segmantation-polls', {
      instanceDefaults: {
        name: null,
        description: null,
        _project_poll_id: null,
        datos: [],
        removed: false
      }
    }),
    service('panel-elements', {
      instanceDefaults: {
        _poll_id: 0,
        questions: [],
        removed: false
      }
    }),
    service('actors', {
      instanceDefaults: {
        name: '',
        description: '',
        code: '',
        tags: [],
        removed: false,
        charges: [],
        politicalParties: []
      }
    }),
    service('actor-categories', {
      instanceDefaults: {
        name: '',
        removed: false
      }
    }),
    service('question-categories', {
      instanceDefaults: {
        name: '',
        description: '',
        removed: false
      }
    }),
    service('master-questions', {
      instanceDefaults: {
        text: '',
        category: '',
        subcategory_questions: {},
        type: '',
        options: '',
        removed: false
      }
    }),
    service('consolidates', {
      instanceDefaults: {
        removed: false
      }
    }),
    service('category-questions', {
      instanceDefaults: {
        name: '',
        value: '',
        removed: false
      }
    }),
    service('position-actors', {
      instanceDefaults: {
        name: '',
        removed: false
      }
    }),
    service('provinces', {
      instanceDefaults: {
        name: '',
        removed: false
      }
    }),
    service('electoral-projects', {
      instanceDefaults: {
        date: '',
        position: '',
        removed: false
      }
    }),
    service('electoral-records', {
      instanceDefaults: {
        removed: false
      }
    }),
    service('audios', {
      instanceDefaults: {
        removed: false
      }
    }),
    service('question-audios', {
      instanceDefaults: {
        removed: false
      }
    }),
    service('countries', {
      instanceDefaults: {
        removed: false
      }
    }),
    service('mobile-survey-results', {
      instanceDefaults: {
        _user_id: '',
        _config_poll_id: '',
        removed: false
      }
    }),
    service('poll-dashboards', {
      instanceDefaults: {
        removed: false,
        name: '',
        dashboardData: [],
        dashboardRows: 0,
        _config_poll_id: null
      }
    }),
    service('companies', {
      instanceDefaults: {
        removed: false,
        name: '',
        address: '',
        ruc: '',
        phone: ''
      }
    }),
    service('route-surveyors', {
      instanceDefaults: {
        latitude: '',
        longitude: '',
        _user_id: '',
        date: ''
      }
    }),
    auth({ userService: 'users' })
  ],
  state: {
    snackMessage: '',
    mapConfigmapConfig: false,
    showSnack: false,
    snackColor: 'success',
    currentEnv: enviroment[enviroment.currentEnviroment].backend.urlBase,
    currentPoll: null,
    mapConfig: {
      cluster: false,
      drawingMode: false
    },
    page: 1,
    asideOpened: false
  },
  getters: {
    getSnackMessage: (state) => {
      return state.snackMessage
    },
    getShowSnack: (state) => {
      return state.getShowSnack
    },
    getPage: (state) => {
      return state.page
    },
    getSnackColor: (state) => {
      return state.getSnackColor
    },
    getCurrentPoll: (state) => {
      return state.currentPoll
    },
    getAsideOpened: (state) => {
      return state.asideOpened
    },
    getMapConfig (state) {
      return state.mapConfig
    }
  },
  mutations: {
    setSnackMessage (state, message) {
      state.snackMessage = message
    },
    setShowSnack (state, show) {
      state.showSnack = show
    },
    setPage (state, page) {
      state.page = page
    },
    setSnackColor (state, type) {
      state.snackColor = type
    },
    setCurrentPoll (state, poll) {
      state.currentPoll = poll
    },
    setAsideOpened (state, opened) {
      state.asideOpened = opened
    },
    setMapConfig (state, config) {
      state.mapConfig = {...config}
    }
  },
  actions: {
    setSnackMessage: ({ commit }, message) => {
      commit('setSnackMessage', message)
    },
    setShowSnack: ({ commit }, show) => {
      commit('setShowSnack', show)
    },
    setPage: ({ commit }, page) => {
      commit('setPage', page)
    },
    setSnackColor: ({ commit }, show) => {
      commit('setSnackColor', show)
    },
    setCurrentPoll: ({ commit }, poll) => {
      commit('setCurrentPoll', poll)
    },
    setAsideOpened: ({ commit }, opened) => {
      commit('setAsideOpened', opened)
    },
    setMapConfig: ({ commit }, config) => {
      commit('setMapConfig', config)
    }
  }
})
