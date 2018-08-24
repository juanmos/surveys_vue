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
    auth({ userService: 'users' })
  ],
  state: {

  },
  mutations: {

  },
  actions: {

  }
})
