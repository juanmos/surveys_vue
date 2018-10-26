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
const CategoryPollList = resolve => {
  require.ensure(['./views/category-poll/CategoryPollList.vue'], () => {
    resolve(require('./views/category-poll/CategoryPollList.vue'))
  }, 'category-poll')
}
const CategoryPollNew = resolve => {
  require.ensure(['./views/category-poll/CategoryPollNew.vue'], () => {
    resolve(require('./views/category-poll/CategoryPollNew.vue'))
  }, 'category-poll')
}
const CategoryGeneralNew = resolve => {
  require.ensure(['./views/category-poll/CategoryGeneralNew.vue'], () => {
    resolve(require('./views/category-poll/CategoryGeneralNew.vue'))
  }, 'category-poll')
}
const CategoryPollAddCode = resolve => {
  require.ensure(['./views/category-poll/CategoryPollFormAddCodes.vue'], () => {
    resolve(require('./views/category-poll/CategoryPollFormAddCodes.vue'))
  }, 'codes-category-polls')
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
const RolesList = resolve => {
  require.ensure(['./views/roles/RolesList.vue'], () => {
    resolve(require('./views/roles/RolesList.vue'))
  }, 'roles')
}
const RolesNew = resolve => {
  require.ensure(['./views/roles/RolesNew.vue'], () => {
    resolve(require('./views/roles/RolesNew.vue'))
  }, 'roles')
}
const QuestionTypeList = resolve => {
  require.ensure(['./views/question-types/QuestionTypeList.vue'], () => {
    resolve(require('./views/question-types/QuestionTypeList.vue'))
  }, 'questiontypes')
}
const QuestionBuilder = resolve => {
  require.ensure(['./views/question-builder/QuesBuildIndex.vue'], () => {
    resolve(require('./views/question-builder/QuesBuildIndex.vue'))
  }, 'questionbuilder')
}
const MenuNew = resolve => {
  require.ensure(['./views/menus/MenuNew.vue'], () => {
    resolve(require('./views/menus/MenuNew.vue'))
  }, 'menus')
}
const MenuList = resolve => {
  require.ensure(['./views/menus/MenuList.vue'], () => {
    resolve(require('./views/menus/MenuList.vue'))
  }, 'menus')
}
const MenuEdit = resolve => {
  require.ensure(['./views/menus/MenuEdit.vue'], () => {
    resolve(require('./views/menus/MenuEdit.vue'))
  }, 'menus')
}
const MenuOrder = resolve => {
  require.ensure(['./views/menus/MenuOrder.vue'], () => {
    resolve(require('./views/menus/MenuOrder.vue'))
  }, 'menus')
}
const PermissionList = resolve => {
  require.ensure(['./views/permissions/PermissionList.vue'], () => {
    resolve(require('./views/permissions/PermissionList.vue'))
  }, 'permission')
}
const PermissionNew = resolve => {
  require.ensure(['./views/permissions/PermissionNew.vue'], () => {
    resolve(require('./views/permissions/PermissionNew.vue'))
  }, 'permission')
}

Vue.use(Router)
const enviroment = require('./../config/enviroment')
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
          window.location = enviroment[enviroment.currentEnviroment].urlAuth
          // next('/pages/login')
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
          path: 'CategoryPollNew',
          name: 'NewCategoryPoll',
          component: CategoryPollNew
        },
        {
          path: 'CategoryGeneralNew',
          name: 'NewCategoryGeneral',
          component: CategoryGeneralNew
        },
        {
          path: 'CategoryPollList/:isgeneral',
          name: 'CategoryPollList',
          component: CategoryPollList
        },
        {
          path: 'CategoryPollFormAddCodes/:category_id/:category_name',
          name: 'CategoryPollAddCode',
          component: CategoryPollAddCode,
          props: true
        },
        {
          path: 'QuestionTypeList',
          name: 'QuestionTypeList',
          component: QuestionTypeList
        },
        {
          path: 'QuesBuildIndex',
          name: 'QuesBuildIndex',
          component: QuestionBuilder
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
        },
        {
          path: 'roles',
          name: 'Roles',
          component: RolesList
        },
        {
          path: 'new-roles',
          name: 'NewRoles',
          component: RolesNew
        },
        {
          path: 'menu-new',
          name: 'MenuNew',
          component: MenuNew
        },
        {
          path: 'menu',
          name: 'MenuList',
          component: MenuList
        },
        {
          path: 'menu-edit/:menu_id',
          name: 'MenuEdit',
          component: MenuEdit
        },
        {
          path: 'menu-order/:id',
          name: 'MenuOrder',
          component: MenuOrder
        },
        {
          path: 'permission',
          name: 'permission',
          component: PermissionList
        },
        {
          path: 'new-permission',
          name: 'NewPermission',
          component: PermissionNew
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
