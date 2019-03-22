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
const Applications = resolve => {
  require.ensure(['./views/Applications'], () => {
    resolve(require('.//views/Applications'))
  }, 'applications')
}
const CustomerNew = resolve => {
  require.ensure(['./views/customers/CustomerNew.vue'], () => {
    resolve(require('./views/customers/CustomerNew.vue'))
  }, 'customers')
}
const CustomerEdit = resolve => {
  require.ensure(['./views/customers/CustomerEdit.vue'], () => {
    resolve(require('./views/customers/CustomerEdit.vue'))
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
  }, 'dashboard')
}
const UserEdit = resolve => {
  require.ensure(['./views/users/UserEdit.vue'], () => {
    resolve(require('./views/users/UserEdit.vue'))
  }, 'userEdit')
}
const UserForm = resolve => {
  require.ensure(['./views/users/UserForm.vue'], () => {
    resolve(require('./views/users/UserForm.vue'))
  }, 'userForm')
}
const UserListAccess = resolve => {
  require.ensure(['./views/users/UserListAccess.vue'], () => {
    resolve(require('./views/users/UserListAccess.vue'))
  }, 'userListAccess')
}
const UserRol = resolve => {
  require.ensure(['./views/users/UserRol.vue'], () => {
    resolve(require('./views/users/UserRol.vue'))
  }, 'userListAccess')
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
const RolesEdit = resolve => {
  require.ensure(['./views/roles/RolesEdit.vue'], () => {
    resolve(require('./views/roles/RolesEdit.vue'))
  }, 'roles')
}
const AssignRol = resolve => {
  require.ensure(['./views/roles/AssignRol.vue'], () => {
    resolve(require('./views/roles/AssignRol.vue'))
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
const CategorysegmentList = resolve => {
  require.ensure(['./views/category-segmentation/CatsegmentList.vue'], () => {
    resolve(require('./views/category-segmentation/CatsegmentList.vue'))
  }, 'category-segmentation')
}
const CategorysegmentNew = resolve => {
  require.ensure(['./views/category-segmentation/CatsegmentNew.vue'], () => {
    resolve(require('./views/category-segmentation/CatsegmentNew.vue'))
  }, 'category-segmentation')
}
const CategorysegmentEdit = resolve => {
  require.ensure(['./views/category-segmentation/CatsegmentForm.vue'], () => {
    resolve(require('./views/category-segmentation/CatsegmentForm.vue'))
  }, 'category-segmentation')
}
const PollsList = resolve => {
  require.ensure(['./views/polls-project/PollsList.vue'], () => {
    resolve(require('./views/polls-project/PollsList.vue'))
  }, 'polls-project')
}
const PollsListNew = resolve => {
  require.ensure(['./views/polls-project/PollsNew.vue'], () => {
    resolve(require('./views/polls-project/PollsNew.vue'))
  }, 'polls-project')
}
const PollsListEdit = resolve => {
  require.ensure(['./views/polls-project/PollsForm.vue'], () => {
    resolve(require('./views/polls-project/PollsForm.vue'))
  }, 'polls-project')
}
const PollsListView = resolve => {
  require.ensure(['./views/polls-project/PollsView.vue'], () => {
    resolve(require('./views/polls-project/PollsView.vue'))
  }, 'polls-project')
}
const UsersPollsList = resolve => {
  require.ensure(['./views/users-polls/UsersPollsList.vue'], () => {
    resolve(require('./views/users-polls/UsersPollsList.vue'))
  }, 'users-polls')
}
const UsersPollsNew = resolve => {
  require.ensure(['./views/users-polls/UsersPollsNew.vue'], () => {
    resolve(require('./views/users-polls/UsersPollsNew.vue'))
  }, 'users-polls')
}
const UsersPollsEdit = resolve => {
  require.ensure(['./views/users-polls/UsersPollsEdit.vue'], () => {
    resolve(require('./views/users-polls/UsersPollsEdit.vue'))
  }, 'users-polls')
}
const QuestionBuilderList = resolve => {
  require.ensure(['./views/question-builder/QuestionBuilderList.vue'], () => {
    resolve(require('./views/question-builder/QuestionBuilderList.vue'))
  }, 'questionbuilder')
}
const QuestionBuilderEdit = resolve => {
  require.ensure(['./views/question-builder/QuestionBuilderEdit.vue'], () => {
    resolve(require('./views/question-builder/QuestionBuilderEdit.vue'))
  }, 'questionbuilder')
}
const QuestionBuilderView = resolve => {
  require.ensure(['./views/question-builder/QuestionBuilderView.vue'], () => {
    resolve(require('./views/question-builder/QuestionBuilderView.vue'))
  }, 'questionbuilder')
}
const UsersProjectsList = resolve => {
  require.ensure(['./views/users-projects/UsersProjectsList.vue'], () => {
    resolve(require('./views/users-projects/UsersProjectsList.vue'))
  }, 'users-projects')
}
const UsersProjectsNew = resolve => {
  require.ensure(['./views/users-projects/UsersProjectsNew.vue'], () => {
    resolve(require('./views/users-projects/UsersProjectsNew.vue'))
  }, 'users-projects')
}
const CategorySegmentationPollsList = resolve => {
  require.ensure(['./views/category-segmentation-polls/CategorySegmentationPollsList.vue'], () => {
    resolve(require('./views/category-segmentation-polls/CategorySegmentationPollsList.vue'))
  }, 'category-segmentation-polls')
}
const CategorySegmentationPollsNew = resolve => {
  require.ensure(['./views/category-segmentation-polls/CategorySegmentationPollsNew.vue'], () => {
    resolve(require('./views/category-segmentation-polls/CategorySegmentationPollsNew.vue'))
  }, 'category-segmentation-polls')
}
const CategorySegmentationPollsEdit = resolve => {
  require.ensure(['./views/category-segmentation-polls/CategorySegmentationPollsEdit.vue'], () => {
    resolve(require('./views/category-segmentation-polls/CategorySegmentationPollsEdit.vue'))
  }, 'category-segmentation-polls')
}

const PollResultsIndex = resolve => {
  require.ensure(['./views/results-view/PollResultsIndex.vue'], () => {
    resolve(require('./views/results-view/PollResultsIndex.vue'))
  }, 'poll-results')
}

const ReportCreator = resolve => {
  require.ensure(['./views/reports-creator/ReportCreator.vue'], () => {
    resolve(require('./views/reports-creator/ReportCreator.vue'))
  }, 'reports-creator')
}

const FullMap = resolve => {
  require.ensure(['./containers/FullMap.vue'], () => {
    resolve(require('./containers/FullMap.vue'))
  }, 'full-map')
}

const QuestionCategories = resolve => {
  require.ensure(['./views/question-categories/QuestionCategoriesList.vue'], () => {
    resolve(require('./views/question-categories/QuestionCategoriesList.vue'))
  }, 'question-categories')
}

const QuestionCategoriesNew = resolve => {
  require.ensure(['./views/question-categories/QuestionCategoriesNew.vue'], () => {
    resolve(require('./views/question-categories/QuestionCategoriesNew.vue'))
  }, 'question-categories')
}

const Actors = resolve => {
  require.ensure(['./views/actors/ActorsList.vue'], () => {
    resolve(require('./views/actors/ActorsList.vue'))
  }, 'actors')
}

const ActorsNew = resolve => {
  require.ensure(['./views/actors/ActorsNew.vue'], () => {
    resolve(require('./views/actors/ActorsNew.vue'))
  }, 'actors')
}

Vue.use(Router)
// const enviroment = require('./../config/enviroment')
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
          // window.location = enviroment[enviroment.currentEnviroment].urlAuth
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
          path: 'user-edit',
          name: 'userEdit',
          component: UserEdit
        },
        {
          path: 'userForm',
          name: 'UserForm',
          component: UserForm
        },
        {
          path: 'list-access',
          name: 'UserListAccess',
          component: UserListAccess
        },
        {
          path: 'user-rol/:_id',
          name: 'UserRol',
          component: UserRol
        },
        {
          path: 'applications',
          name: 'Applications',
          component: Applications
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
          path: 'customer-view/:_id',
          name: 'CustomerEdit',
          component: CustomerEdit
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
          path: 'QuesBuildIndex/:id',
          name: 'QuesBuildIndex',
          component: QuestionBuilder,
          props: true
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
          path: 'edit-roles/:_id',
          name: 'RolesEdit',
          component: RolesEdit
        },
        {
          path: 'assign-rol',
          name: 'AssignRol',
          component: AssignRol
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
        },
        {
          path: 'category-segmentation',
          name: 'Categorysegmentation',
          component: CategorysegmentList
        },
        {
          path: 'new-category-segmentation',
          name: 'NewCategorysegmentation',
          component: CategorysegmentNew
        },
        {
          path: 'Edit-category-segmentation',
          name: 'EditCategorysegmentation',
          component: CategorysegmentEdit
        },
        {
          path: 'polls-project',
          name: 'Pollslist',
          component: PollsList
        },
        {
          path: 'new-polls-project',
          name: 'NewPollslist',
          component: PollsListNew
        },
        {
          path: 'edit-polls-project',
          name: 'EditPollsprojects',
          component: PollsListEdit
        },
        {
          path: 'view-polls-project/:id',
          name: 'ViewPollsprojects',
          component: PollsListView
        },
        {
          path: 'users-polls',
          name: 'UsersPollsList',
          component: UsersPollsList
        },
        {
          path: 'users-polls-new',
          name: 'UsersPollsNew',
          component: UsersPollsNew
        },
        {
          path: 'users-polls-edit/:_id',
          name: 'UsersPollsEdit',
          component: UsersPollsEdit
        },
        {
          path: 'question-builder/:id',
          name: 'QuestionBuilderList',
          component: QuestionBuilderList
        },
        {
          path: 'question-builder-edit/:id',
          name: 'QuestionBuilderEdit',
          component: QuestionBuilderEdit
        },
        {
          path: 'users-projects/:_id',
          name: 'UsersProjectsList',
          component: UsersProjectsList
        },
        {
          path: 'users-projects-new/:_id',
          name: 'UsersProjectsNew',
          component: UsersProjectsNew
        },
        {
          path: 'category-segmentation-polls/:_id',
          name: 'CategorySegmentationPollsList',
          component: CategorySegmentationPollsList
        },
        {
          path: 'category-segmentation-polls-new/:_id',
          name: 'CategorySegmentationPollsNew',
          component: CategorySegmentationPollsNew
        },
        {
          path: 'category-segmentation-polls-edit/:_id',
          name: 'CategorySegmentationPollsEdit',
          component: CategorySegmentationPollsEdit
        },
        {
          path: 'question-builder-view/:id',
          name: 'QuestionBuilderView',
          component: QuestionBuilderView
        },
        {
          path: 'poll-results/:id',
          name: 'PollResultsIndex',
          props: true,
          component: PollResultsIndex
        },
        {
          path: 'report-creator/:id',
          name: 'ReportCreator',
          props: true,
          component: ReportCreator
        },
        {
          path: 'actors',
          name: 'actors',
          props: true,
          component: Actors
        },
        {
          path: 'actors-new',
          name: 'actors-new',
          props: true,
          component: ActorsNew
        },
        {
          path: 'question-categories',
          name: 'question-categories',
          props: true,
          component: QuestionCategories
        },
        {
          path: 'question-categories-new',
          name: 'question-categories-new',
          props: true,
          component: QuestionCategoriesNew
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
      path: '/map',
      redirect: '/map/404',
      name: 'Map',
      component: {
        render (c) { return c('router-view') }
      },
      beforeEnter (to, from, next) {
        store.dispatch('auth/authenticate').then(() => {
          next()
        }).catch((err) => {
          console.log(err)
          // window.location = enviroment[enviroment.currentEnviroment].urlAuth
          next('/pages/login')
        })
      },
      children: [
        {
          path: 'full/:id',
          props: true,
          name: 'Full',
          component: FullMap
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
