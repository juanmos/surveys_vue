import Vue from 'vue'
import Router from 'vue-router'

import store from './store'
const Full = resolve => {
  require.ensure(['./containers/Full.vue'], () => {
    resolve(require('./containers/Full.vue'))
  }, 'full')
}
const WorkingTable = resolve => {
  require.ensure(['./containers/WorkingTable.vue'], () => {
    resolve(require('./containers/WorkingTable.vue'))
  }, 'worgingTable')
}
const Login = resolve => {
  require.ensure(['./views/Login.vue'], () => {
    resolve(require('./views/Login.vue'))
  }, 'login')
}
const UserList = resolve => {
  require.ensure(['./views/users/UserList.vue'], () => {
    resolve(require('./views/users/UserList.vue'))
  }, 'users')
}
const UserNew = resolve => {
  require.ensure(['./views/users/UserNew.vue'], () => {
    resolve(require('./views/users/UserNew.vue'))
  }, 'users')
}
const StudiesList = resolve => {
  require.ensure(['./views/studies/StudiesList.vue'], () => {
    resolve(require('./views/studies/StudiesList.vue'))
  }, 'studies')
}
const StudiesNew = resolve => {
  require.ensure(['./views/studies/StudiesNew.vue'], () => {
    resolve(require('./views/studies/StudiesNew.vue'))
  }, 'studies')
}
const CustomerNew = resolve => {
  require.ensure(['./views/customers/CustomerNew.vue'], () => {
    resolve(require('./views/customers/CustomerNew.vue'))
  }, 'customers')
}
const CustomerList = resolve => {
  require.ensure(['./views/customers/CustomerList.vue'], () => {
    resolve(require('./views/customers/CustomerList.vue'))
  }, 'customers')
}
const Dashboard = resolve => {
  require.ensure(['./views/Dashboard.vue'], () => {
    resolve(require('./views/Dashboard.vue'))
  }, 'login')
}
const BoardsDetail = resolve => {
  require.ensure(['./views/boards/BoardsDetail.vue'], () => {
    resolve(require('./views/boards/BoardsDetail.vue'))
  }, 'boards')
}
const WorkingTableList = resolve => {
  require.ensure(['./views/working-tables/WorkingTableList.vue'], () => {
    resolve(require('./views/working-tables/WorkingTableList.vue'))
  }, 'workingTableList')
}
const WorkingTableNew = resolve => {
  require.ensure(['./views/working-tables/WorkingTableNew.vue'], () => {
    resolve(require('./views/working-tables/WorkingTableNew.vue'))
  }, 'workingTableNew')
}
const ClientHome = resolve => {
  require.ensure(['./views/clients/ClientHome.vue'], () => {
    resolve(require('./views/clients/ClientHome.vue'))
  }, 'clients')
}
const RegionList = resolve => {
  require.ensure(['./views/regions/RegionList.vue'], () => {
    resolve(require('./views/regions/RegionList.vue'))
  }, 'regions')
}
const RegionNew = resolve => {
  require.ensure(['./views/regions/RegionNew.vue'], () => {
    resolve(require('./views/regions/RegionNew.vue'))
  }, 'regions')
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: 'dashboard',
      component: Full,
      beforeEnter (to, from, next) {
        store.dispatch('auth/authenticate').then(() => {
          next()
        }).catch((err) => {
          console.log(err)
          next('/pages/login')
        })
      },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'users',
          name: 'Users',
          component: UserList
        },
        {
          path: 'new-user',
          name: 'NewUsers',
          component: UserNew
        },
        {
          path: 'studies',
          name: 'Studies',
          component: StudiesList
        },
        {
          path: 'new-studies',
          name: 'NewStudies',
          component: StudiesNew
        },
        {
          path: 'working-tables',
          name: 'WorkingTableList',
          component: WorkingTableList
        },
        {
          path: 'working-table-new',
          name: 'WorkingTableNew',
          component: WorkingTableNew
        },
        {
          path: 'customers',
          name: 'Customers',
          component: CustomerList
        },
        {
          path: 'new-customer',
          name: 'NewCustomers',
          component: CustomerNew
        },
        {
          path: 'regions',
          name: 'Regions',
          component: RegionList
        },
        {
          path: 'new-region',
          name: 'NewRegion',
          component: RegionNew
        }
      ]
    },
    {
      path: '/mesa-trabajo',
      name: 'mesaTrabajo',
      redirect: '/',
      component: WorkingTable,
      beforeEnter (to, from, next) {
        store.dispatch('auth/authenticate').then(() => {
          next()
        }).catch((err) => {
          console.log(err)
          next('/pages/login')
        })
      },
      children: [
        {
          path: 'boards/:id',
          name: 'BoardsDetail',
          props: true,
          component: BoardsDetail
        }
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'home',
          name: 'Home',
          component: ClientHome
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
