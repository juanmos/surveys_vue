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
                      append-icon="search"
                      label="Buscar por nombre"
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
                  :items="getUsersPolls"
                  hide-actions
                  item-key="name"
                  :search="search"
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
                            <v-list-tile @click="dialog = true;itemSelected=props.item">
                              <v-list-tile-title >Eliminar</v-list-tile-title>
                            </v-list-tile>
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
    </v-container>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import {validations} from './../../utils/validations'
import EditableField from './../../components/forms/EditableField'
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
      filterRol: null,
      roles: null,
      rules: validations,
      message: '',
      showMsg: false,
      search: '',
      msgType: 'error',
      page: 1,
      limit: 10,
      total: 1,
      itemSelected: null,
      loaded: false,
      categories: [],
      query: {},
      dialog: false
    }
  },
  methods: {
    ...mapActions('users', { findUsersPolls: 'find' }),
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
    }
  },
  computed: {
    ...mapState('users', {loading: 'isFindPending'}),
    ...mapState('users', { paginationVal: 'pagination' }),
    ...mapGetters('users', {findUsersPollsInStore: 'find'}),
    ...mapGetters('roles', {findRolesInStore: 'find'}),
    getUsersPolls () {
      return this.findUsersPollsInStore({query: {removed: false, ...this.query}}).data
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
    }
  },
  watch: {
    page () {
      this.findUsersPolls({query: {removed: false, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findUsersPolls({removed: false, ...this.query}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.categories = response.data
    })
    this.findRoles({query: {removed: false, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.roles = response.data
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style>

</style>
