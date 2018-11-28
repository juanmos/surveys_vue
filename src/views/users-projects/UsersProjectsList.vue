<template>
<div >
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Personas del proyecto</v-subheader>
              <v-card-title>
                <v-flex xs6>
                    <v-text-field
                      v-model="search"
                      append-icon="search"
                      label="Buscar por nombre"
                      single-line
                      hide-details
                    ></v-text-field>
                </v-flex>
              </v-card-title>
            <v-data-table
                  :headers="headers"
                  :items="getUsersProjects"
                  hide-actions
                  item-key="name"
                  :search="search"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td class="text-xs-left">{{props.item.name}}</td>
                      <td class="text-xs-left">{{props.item.email}}</td>
                      <td class="text-xs-left">{{getNameRol(props.item._rol_id)}}</td>
                      <td class="justify-center layout px-0">
                        <v-menu
                          bottom
                          transition="slide-y-transition"
                        >
                          <v-btn
                            slot="activator"
                            color="primary"
                            flat
                            icon
                          >
                            <v-icon>more_vert</v-icon>
                          </v-btn>
                              <v-list>
                                      <v-list-tile @click="dialog = true;itemSelected=props.item">
                                        <v-list-tile-title >Eliminar</v-list-tile-title>
                                      </v-list-tile>
                                      <v-dialog
                                        v-model="dialog"
                                        max-width="290"
                                      >
                                        <v-card>
                                          <v-card-title class="headline">Eliminar del proyecto</v-card-title>

                                          <v-card-text>
                                            Esta seguro de eliminar al usuario del proyecto?
                                          </v-card-text>

                                          <v-card-actions>
                                            <v-spacer></v-spacer>

                                            <v-btn
                                              color="red darken-4"
                                              flat="flat"
                                              @click="dialog = false"
                                            >
                                              Cancelar
                                            </v-btn>

                                            <v-btn
                                              color="teal darken-3"
                                              flat="flat"
                                              @click="dialog = false, del()"
                                            >
                                              Aceptar
                                            </v-btn>
                                          </v-card-actions>
                                        </v-card>
                                      </v-dialog>
                                </v-list>
                        </v-menu>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
                <v-layout justify-center>
                  <v-flex xs8>
                    <v-card flat>
                      <v-card-text>
                        <v-pagination
                          v-model="page"
                          :length="getLength"
                        ></v-pagination>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
                <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="pink"
                @click="goToNew()"
                >
                    <v-icon>add</v-icon>
                </v-btn>
                <loading-component v-if="loading
                "></loading-component>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import {validations} from './../../utils/validations'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      headers: [
        {
          text: 'Nombre',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'Correo electrónico',
          value: 'url',
          sortable: false
        },
        { text: 'Rol',
          value: 'rol',
          sortable: false
        },
        { text: 'Acciones',
          value: 'name',
          sortable: false
        }
      ],
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      filterRol: null,
      roles: null,
      rules: validations,
      project: null,
      message: '',
      showMsg: false,
      search: '',
      msgType: 'error',
      page: 1,
      user: null,
      limit: 20,
      total: 1,
      itemSelected: null,
      loaded: false,
      query: {},
      dialog: false
    }
  },
  methods: {
    ...mapActions('users-projects', { findUsersProjects: 'find' }),
    ...mapActions('roles', { findRoles: 'find' }),
    ...mapActions(['setSnackMessage', 'setShowSnack']),
    goToNew () {
      this.$router.push('/users-projects-new/' + this.project)
    },
    goToEdit (codigo) {
      // console.log('mi codigo es ', codigo)
      this.$router.push('/users-polls-edit/' + codigo)
    },
    getNameRol (id) {
      let data = this.findRolesInStore({query: {removed: false, _id: id, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
      let name = ''
      if (data.length > 0 && data[0].name) {
        name = data[0].name
      }
      return name
    },
    save (val) {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    del () {
      const {UsersProject} = this.$FeathersVuex
      const userProject = new UsersProject(this.itemSelected)
      userProject.removed = true
      let that = this
      userProject.patch().then((result) => {
        that.findUsersProjects({ query: {removed: false} }).then(response => {
          that.setSnackMessage('El usuario ya no forma parte del proyecto.')
          return response.data || response
        })
      })
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close (val) {
      // console.log('Dialog closed', val)
    },
    addUserProject (values) {
      values._user_id = values._user_id
      values._project_id = this.project
      const { UsersProject } = this.$FeathersVuex
      let usersProyects = new UsersProject(values)
      let check = this.checkExistUserToProject(values._user_id)
      if (check === false) {
        usersProyects.save().then((result) => {
          this.setSnackMessage('Usuario asignado al proyecto')
          this.setShowSnack(true)
        }, (err) => { console.log(err) })
      } else {
        this.setSnackMessage('Usuario ya esta asignado al proyecto')
        this.setShowSnack(true)
      }
      // this.$router.push('/users-polls-edit/' + code)
    },
    checkExistUserToProject (code) {
      let data = this.findUsersProjectsInStore({query: {removed: false, _user_id: code, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
      let check = false
      if (data.length > 0) {
        check = true
      }
      return check
    }
  },
  computed: {
    ...mapState('users-projects', {loading: 'isFindPending'}),
    ...mapState('users-projects', { paginationVal: 'pagination' }),
    ...mapGetters('users-projects', {findUsersProjectsInStore: 'find'}),
    ...mapGetters('roles', {findRolesInStore: 'find'}),
    getUsersProjects () {
      return this.findUsersProjectsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data.map(data => (data.user))
    },
    getLength () {
      return Math.round((this.total / this.limit)) === 0 ? 1 : Math.round((this.total / this.limit)) + 1
    },
    getSkip () {
      return this.page === 1 ? 0 : Math.round(((this.page - 1) * this.limit))
    }
  },
  watch: {
    page () {
      this.findUsersProjects({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.project = this.$route.params._id
    this.findUsersProjects({$skip: this.getSkip, $limit: this.limit, _project_id: this.project, removed: false, ...this.query}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
    })
    this.findRoles({query: {removed: false, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.roles = response.data
    })
  },
  components: {LoadingComponent}
}
</script>

<style>

</style>
