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
const CategoryProjectList = resolve => {
  require.ensure(['./views/category-projects/CategoryProjectList.vue'], () => {
    resolve(require('./views/category-projects/CategoryProjectList.vue'))
  }, 'category-projects')
}
const CategoryProjectNew = resolve => {
  require.ensure(['./views/category-projects/CategoryProjectNew.vue'], () => {
    resolve(require('./views/category-projects/CategoryProjectNew.vue'))
  }, 'category-projects')
}
const MenuItemList = resolve => {
  require.ensure(['./views/menu-items/MenuItemList.vue'], () => {
    resolve(require('./views/menu-items/MenuItemList.vue'))
  }, 'menu-items')
}
const MenuItemNew = resolve => {
  require.ensure(['./views/menu-items/MenuItemNew.vue'], () => {
    resolve(require('./views/menu-items/MenuItemNew.vue'))
  }, 'menu-items')
}
const MenuIconList = resolve => {
  require.ensure(['./views/menu-items/MenuIconList.vue'], () => {
    resolve(require('./views/menu-items/MenuIconList.vue'))
  }, 'menu-items')
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
          name: 'CategoryProjectList',
          component: CategoryProjectList
        },
        {
          path: 'category-project-new',
          name: 'CategoryProjectNew',
          component: CategoryProjectNew
        },
        {
          path: 'menu-item',
          name: 'MenuItemList',
          component: MenuItemList
        },
        {
          path: 'menu-icon-list',
          name: 'MenuIconList',
          component: MenuIconList
        },
        {
          path: 'menu-item-new',
          name: 'MenuItemnew',
          component: MenuItemNew
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
