<template>
<div >
    <v-container fluid grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Administración de Usuarios</v-subheader>
              <v-card-title>
                <v-flex xs6>
                    <v-text-field
                            v-model="search"
                            @keyup.enter="searchUserName"
                            @keyup.space="searchUserName"
                            append-icon="search"
                            label="Buscar por nombre..."
                            single-line
                            hide-details
                          ></v-text-field>
                    <v-select
                      v-model="filterRol"
                      v-bind:items="getRoles"
                      item-text="name"
                      item-value="_id"
                      label="Rol"
                    ></v-select>
                </v-flex>
              </v-card-title>
            <v-data-table
                  :headers="headers"
                  :items="users"
                  hide-actions
                  item-key="name"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td>
                        <v-edit-dialog
                          :return-value.sync="props.item.name"
                          lazy
                          @save="edit(props.item.name, props.item, 'name')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.name }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.name"
                            label="Editar Nombre"
                            single-line
                            counter
                            :rules="MyRules"
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
                      <td>
                        <v-edit-dialog
                          :return-value.sync="props.item.email"
                          lazy
                          @save="edit(props.item.email, props.item, 'email')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.email }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.email"
                            label="Editar email"
                            single-line
                            counter
                            :rules="MyRules"
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
                      <td class="text-xs-left">{{getNameRol(props.item._rol_id)}}</td>
                      <td class="text-xs-left">{{props.item.company.name}}</td>
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
                            <v-list-tile @click="goToEdit(props.item._id)">
                                <v-list-tile-title >Editar</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="getDataRoute(props.item)">
                                <v-list-tile-title >Ver ruta</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="dialog = true;itemSelected=props.item">
                              <v-list-tile-title >Eliminar</v-list-tile-title>
                            </v-list-tile>
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
                color="primary"
                @click="goToNew()"
                >
                    <v-icon>add</v-icon>
                </v-btn>
                <loading-component v-if="loading
                "></loading-component>
            </v-card>
        </v-flex>
        </v-layout>
        <v-dialog
          v-model="dialog"
          max-width="290"
        >
          <v-card>
            <v-card-title class="headline">Eliminar usuario</v-card-title>

            <v-card-text>
              Esta seguro que desea eliminar la usuario?
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

        <v-dialog v-model="dialogMap" fullscreen v-if="dialogMap">
              <v-card>
                <v-card-title>
                    <span class="title">RUTA DE {{itemSelected.name}}</span>
                </v-card-title>
                    <v-card-actions>
                     <v-spacer></v-spacer>
                     <v-btn color="dark darken-1"
                            flat="flat"
                            style="background: #000;"
                            @click="dialogMap = false"
                              >
                              CERRAR
                     </v-btn>
                   </v-card-actions>
                   <v-layout row wrap>
                       <v-flex xs3 justify="center">
                           <center>
                               <v-date-picker v-model="dateCurrent" locale="es-es"></v-date-picker>
                           </center>
                       </v-flex>
                       <v-flex xs9>
                           <map-polylines-component :markers="points" :gmapCenter="dataGmapCenter"></map-polylines-component>
                       </v-flex>
                   </v-layout>
              </v-card>
            </v-dialog>
    </v-container>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import {validations} from './../../utils/validations'
import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
import MapPolylinesComponent from './../../components/graphs/MapPolylines'
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
        { text: 'Empresa',
          value: 'company',
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
      dateCurrent: new Date().toISOString().substr(0, 10),
      filterRol: null,
      roles: null,
      dialogMap: false,
      rules: validations,
      message: '',
      points: [],
      dataGmapCenter: {
        lat: 0,
        lng: 0
      },
      showMsg: false,
      search: '',
      users: [],
      msgType: 'error',
      page: 1,
      limit: 20,
      total: 1,
      itemSelected: null,
      loaded: false,
      query: {},
      dialog: false
    }
  },
  methods: {
    ...mapActions('users', { findUsersPolls: 'find' }),
    ...mapActions('route-surveyors', { findRouteSurveyors: 'find' }),
    ...mapActions('roles', { findRoles: 'find' }),
    goToNew (code) {
      this.$router.push('/users-polls-new')
    },
    goToEdit (code) {
      this.$router.push('/users-polls-edit/' + code)
    },
    save (val) {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    getUsers () {
      this.findUsersPolls({query: {removed: false, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.users = response.data
        this.loaded = true
      })
    },
    getRouteSurveyors () {
      this.findRouteSurveyors({query: {_user_id: this.itemSelected._id, date: this.dateCurrent, $limit: null, $skip: 0}}).then(response => {
        this.points = response.data.map(point => {
          return {
            lat: point.latitude,
            lng: point.longitude
          }
        })
      })
    },
    getNameRol (id) {
      let data = this.findRolesInStore({query: {removed: false, _id: id, ...this.query}}).data
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
    },
    edit (val, elem, field) {
      if (val !== '') {
        const {UsersPoll} = this.$FeathersVuex
        const usersPolls = new UsersPoll(elem)
        usersPolls[field] = val
        usersPolls.patch().then((result) => {
          this.findUsersPolls({ query: {removed: false} }).then(response => {
            return response.data || response
          })
        })
      }
    },
    del () {
      const {UsersPoll} = this.$FeathersVuex
      const userPolls = new UsersPoll(this.itemSelected)
      userPolls.removed = true
      userPolls.patch().then((result) => {
        this.findUsersPolls({ query: {removed: false} }).then(response => {
          return response.data || response
        })
      })
    },
    searchUserName () {
      this.findUsersPolls({query: {$or: [{name: {$search: this.search}}], $sort: { name: '1' }, removed: false, $skip: 0, $limit: null}}).then((result) => {
        this.loaded = true
        this.users = result.data
      })
    },
    getDataRoute (user) {
      this.itemSelected = user
      this.dialogMap = true
      this.getRouteSurveyors()
    }
  },
  computed: {
    ...mapState('users', {loading: 'isFindPending'}),
    ...mapState('users', { paginationVal: 'pagination' }),
    ...mapGetters('users', {findUsersPollsInStore: 'find'}),
    ...mapGetters('roles', {findRolesInStore: 'find'}),
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
    }
  },
  watch: {
    page () {
      this.findUsersPolls({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.loaded = true
        this.users = response.data
        this.total = response.total
      })
    },
    filterRol: function (val) {
      let searchRolId = {}
      if (val) {
        searchRolId._rol_id = val
        this.findUsersPolls({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...searchRolId}}).then(response => {
          this.limit = response.limit
          this.loaded = true
          this.users = response.data
          this.total = response.total
        })
      } else {
        this.getUsers()
      }
    },
    dateCurrent: function (val) {
      this.dateCurrent = val
      this.getRouteSurveyors()
    }
  },
  created () {
    this.getUsers()
    this.findRoles({query: {removed: false, ...this.query}}).then(response => {
      this.loaded = true
      this.roles = response.data
    })
  },
  components: {LoadingComponent, MapPolylinesComponent, EditableField}
}
</script>

<style>
.title {
    font-weight: bold;
    font-size: 14px;
     text-transform: uppercase;
}
</style>
