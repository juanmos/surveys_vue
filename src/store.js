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
    service('boards', {
      instanceDefaults: {
        name: '',
        category: '',
        _user_id: '',
        memberIds: [],
        graphic_content: {},
        nodeDataArray: [],
        linkDataArray: []
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
    service('studies', {
      instanceDefaults: {
        name: '',
        description: '',
        _user_id: '',
        memberIds: [],
        sub_studies: [],
        geographical_scope: '',
        _customer_id: ''
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
    service('countries', {
      instanceDefaults: {
        name: '',
        removed: false
      }
    }),
    service('cities', {
      instanceDefaults: {
        name: '',
        _country_id: '',
        removed: false
      }
    }),
    service('customer-contacts', {
      instanceDefaults: {
        name: '',
        phones: '',
        cellphones: '',
        email: '',
        position: '',
        _customer_id: '',
        removed: false
      }
    }),
    service('main-constructs', {
      instanceDefaults: {
        name: '',
        _board_id: '',
        color: '',
        description: ''
      }
    }),
    service('graph-defaults', {
      instanceDefaults: {
        component: '',
        nodeDataArray: []
      }
    }),
    service('working-tables', {
      instanceDefaults: {
        name: '',
        description: '',
        component: '',
        type: '',
        removed: false
      }
    }),
    service('table-instances', {
      instanceDefaults: {
        name: '',
        _working_table_id: '',
        _board_id: '',
        incorporates: [],
        nodeDataArray: [],
        linkDataArray: [],
        deletes: [],
        weakens: [],
        threats: [],
        opportunities: [],
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
        description: ''
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
    auth({ userService: 'users' })
  ],
  state: {
    studyId: null,
    currentMapId: null,
    currentTableInstanceId: null,
    currentConstructId: null,
    currentConstruct: {},
    currentDiagram: null,
    snackMessage: '',
    showSnack: false,
    snackColor: 'success'
  },
  getters: {
    getStudyId: (state) => {
      return state.studyId
    },
    getCurrentMapId: (state) => {
      return state.currentMapId
    },
    getCurrentTableInstanceId: (state) => {
      return state.currentTableInstanceId
    },
    getCurrentConstructId: (state) => {
      return state.currentConstructId
    },
    getCurrentConstruct: (state) => {
      return state.currentConstruct
    },
    getCurrentDiagram: (state) => {
      return state.currentDiagram
    },
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
    setStudyId (state, id) {
      state.studyId = id
    },
    setCurrentMapId (state, id) {
      state.currentMapId = id
    },
    setCurrentTableInstanceId (state, id) {
      state.currentTableInstanceId = id
    },
    setCurrentConstructId (state, id) {
      state.currentConstructId = id
    },
    setCurrentConstruct (state, construct) {
      state.currentConstruct = construct
    },
    setCurrentDiagram (state, type) {
      state.currentDiagram = type
    },
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
    setStudyId: ({ commit }, id) => {
      commit('setStudyId', id)
    },
    setCurrentMapId: ({ commit }, id) => {
      commit('setCurrentMapId', id)
    },
    setCurrentTableInstanceId: ({ commit }, id) => {
      commit('setCurrentTableInstanceId', id)
    },
    setCurrentConstructId: ({ commit }, id) => {
      commit('setCurrentConstructId', id)
    },
    setCurrentConstruct: ({ commit }, construct) => {
      commit('setCurrentConstruct', construct)
    },
    setCurrentDiagram: ({ commit }, type) => {
      commit('setCurrentDiagram', type)
    },
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
