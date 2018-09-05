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
        graphic_content: {}
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
    service('working-tables', {
      instanceDefaults: {
        name: '',
        type: ''
      }
    }),
    auth({ userService: 'users' })
  ],
  state: {
    studyId: null,
    currentMapId: null,
    currentConstructId: null,
    currentDiagram: null
  },
  getters: {
    getStudyId: (state) => {
      return state.studyId
    },
    getCurrentMapId: (state) => {
      return state.currentMapId
    },
    getCurrentConstructId: (state) => {
      return state.currentConstructId
    },
    getCurrentDiagram: (state) => {
      return state.currentDiagram
    }
  },
  mutations: {
    setStudyId (state, id) {
      state.studyId = id
    },
    setCurrentMapId (state, id) {
      state.currentMapId = id
    },
    setCurrentConstructId (state, id) {
      state.currentConstructId = id
    },
    setCurrentDiagram (state, type) {
      state.currentDiagram = type
    }
  },
  actions: {
    setStudyId: ({ commit }, id) => {
      commit('setStudyId', id)
    },
    setCurrentMapId: ({ commit }, id) => {
      commit('setCurrentMapId', id)
    },
    setCurrentConstructId: ({ commit }, id) => {
      commit('setCurrentConstructId', id)
    },
    setCurrentDiagram: ({ commit }, type) => {
      commit('setCurrentDiagram', type)
    }
  }
})
