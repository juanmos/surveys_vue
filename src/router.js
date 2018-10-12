import Vue from 'vue'
import Router from 'vue-router'

import store from './store'
const Full = resolve => {
  require.ensure(['./containers/Full.vue'], () => {
    resolve(require('./containers/Full.vue'))
  }, 'full')
}
const Login = resolve => {
  require.ensure(['./views/Login.vue'], () => {
    resolve(require('./views/Login.vue'))
  }, 'login')
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
const CProjectList = resolve => {
  require.ensure(['./views/category-projects/CProjectList.vue'], () => {
    resolve(require('./views/category-projects/CProjectList.vue'))
  }, 'category-projects')
}
const CProjectNew = resolve => {
  require.ensure(['./views/category-projects/CProjectNew.vue'], () => {
    resolve(require('./views/category-projects/CProjectNew.vue'))
  }, 'category-projects')
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
        },
        {
          path: 'category-project',
          name: 'CProjectList',
          component: CProjectList
        },
        {
          path: 'category-project-new',
          name: 'CProjectNew',
          component: CProjectNew
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
