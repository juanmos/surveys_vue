<template>
<div >
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Agregar Personas</v-subheader>
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
                  :items="getUsersPolls"
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
                            <v-list-tile @click="addUserProject(props.item)">
                                <v-list-tile-title >Agregar</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="dialog = true;itemSelected=props.item">
                              <v-list-tile-title >Eliminar</v-list-tile-title>
                            </v-list-tile>
                            <v-dialog
                              v-model="dialog"
                              max-width="290"
                            >
                              <v-card>
                                <v-card-title class="headline">Eliminar categoría</v-card-title>

                                <v-card-text>
                                  Esta seguro que desea eliminar la categoría?
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
      project: null,
      rules: validations,
      message: '',
      showMsg: false,
      search: '',
      msgType: 'error',
      page: 1,
      limit: 20,
      total: 1,
      itemSelected: null,
      loaded: false,
      categories: [],
      query: {},
      dialog: false
    }
  },
  methods: {
    ...mapActions('users-polls', { findUsersPolls: 'find' }),
    ...mapActions('users-projects', { findUsersProjects: 'find' }),
    ...mapActions('roles', { findRoles: 'find' }),
    ...mapActions(['setSnackMessage', 'setShowSnack']),
    goToNew (code) {
      this.$router.push('/users-projects-new/' + code)
    },
    addUserProject (values) {
      let data = {'_user_id': values._id, '_project_id': this.project}
      let check = this.checkExistUserToProject(values._id)
      if (check === false) {
        const { UsersProject } = this.$FeathersVuex
        let usersProyect = new UsersProject(data)
        let that = this
        usersProyect.save().then((result) => {
          that.$router.push('/users-projects/' + that.project)
          that.setSnackMessage('Usuario ha sido asignado al proyecto')
          that.setShowSnack(true)
        }, (err) => { console.log(err) })
      } else {
        this.setSnackMessage('El usuario ya forma parte al proyecto')
        this.setShowSnack(true)
      }
    },
    checkExistUserToProject (code) {
      let data = this.findUsersProjectsInStore({query: {_user_id: code, removed: false}}).data
      let check = false
      if (data.length > 0) {
        check = true
      }
      return check
    },
    getNameRol (id) {
      let data = this.findRolesInStore({query: {removed: false, _id: id, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
      let name = ''
      if (data.length > 0 && data[0].name) {
        name = data[0].name
      }
      return name
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
    }
  },
  computed: {
    ...mapState('users-polls', {loading: 'isFindPending'}),
    ...mapState('users-polls', { paginationVal: 'pagination' }),
    ...mapGetters('users-polls', {findUsersPollsInStore: 'find'}),
    ...mapGetters('roles', {findRolesInStore: 'find'}),
    ...mapGetters('users-projects', {findUsersProjectsInStore: 'find'}),
    getUsersPolls () {
      if (this.filterRol != null) {
        return this.findUsersPollsInStore({query: {removed: false, _rol_id: this.filterRol, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
      } else {
        return this.findUsersPollsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
      }
    },
    getLength () {
      return Math.round((this.total / this.limit)) === 0 ? 1 : Math.round((this.total / this.limit)) + 1
    },
    getSkip () {
      return this.page === 1 ? 0 : Math.round(((this.page - 1) * this.limit))
    },
    getRoles () {
      let listRoles = this.findRolesInStore({query: {removed: false, ...this.query}}).data
      let option = {
        'name': 'TODOS',
        '_id': null
      }
      listRoles.push(option)
      return listRoles
    },
    getUsersProyects () {
      let listRoles = this.findRolesInStore({query: {removed: false, ...this.query}}).data
      let option = {
        'name': 'TODOS',
        '_id': null
      }
      listRoles.push(option)
      return listRoles
    }
  },
  watch: {
    page () {
      this.findUsersPolls({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.project = this.$route.params._id
    this.findUsersPolls({$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
    })
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
