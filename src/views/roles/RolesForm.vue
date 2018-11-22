<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
            <v-form v-model="valid"
            @submit.prevent="sendData"
            @keydown.prevent.enter
            >
          <v-flex xs12>

                <v-text-field
                  v-model="rol.name"
                  :rules="rules.nameRules"
                  label="Nombre"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                 <v-text-field
                  v-model="rol.description"
                  :rules="rules.nameRules"
                  label="Descripción"
                  box
                  color="blue-grey lighten-2"
                ></v-text-field>
          </v-flex>
          <v-flex xs12>
              <v-btn
                small
                color="secondary"
                 @click.native="addService()">
                AGREGAR PERMISOS
              </v-btn>
                &nbsp;
              <v-btn small
                  type="submit" :disabled="!valid"
                  color="success"
                >
                  GUARDAR ROL
                </v-btn>
          </v-flex>
          </v-form>
          <v-flex xs12>
              <v-data-table
                    :headers="headers"
                    :items="getViewPermissions"
                    hide-actions
                    item-key="name"
                  >
                    <template slot="items" slot-scope="props">
                      <tr @click="props.expanded = !props.expanded">
                        <td class="text-xs-left">{{props.item}}</td>
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
                              <v-list-tile @click="editService(props.item)">
                                <v-list-tile-title>Editar</v-list-tile-title>
                              </v-list-tile>
                              <v-list-tile @click="del(props.item)">
                                <v-list-tile-title>Eliminar</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
          </v-flex>

            <v-dialog v-model="addRestfulModal" width="700" persistent>
              <v-card>
                <v-card-title>{{modalTitle}}</v-card-title>
                <v-card-text>
                  <v-container fluid grid-list-md>
                    <v-layout row wrap>
                      <v-flex xs12 md6>
                          <v-autocomplete v-bind:items="getServices"
                          item-text="name"
                          item-value="_id"
                          v-model="service" label="Servicio:"
                          ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 md12>
                        <v-container fluid>
                            <v-layout row wrap>
                              <v-flex xs12 sm3>
                                <v-checkbox
                                v-model="read"
                                  label="Leer"
                                ></v-checkbox>
                              </v-flex>
                              <v-flex xs6 sm3>
                                <v-checkbox
                                v-model="created"
                                  label="Crear"
                                ></v-checkbox>
                              </v-flex>
                              <v-flex xs6 sm3>
                                <v-checkbox
                                v-model="edit"
                                  label="Editar"
                                ></v-checkbox>
                              </v-flex>
                              <v-flex xs6 sm3>
                                <v-checkbox
                                v-model="drop"
                                  label="Eliminar"
                                ></v-checkbox>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn class="green--text darken-1" flat="flat" @click.native="savePermissions">Agregar</v-btn>
                  <v-btn class="green--text darken-1" flat="flat" @click.native="cancelAddPermiso">Cancelar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

        </v-layout>
      </v-container>
     <confirm-dialog :dialog="dialog" :dialogTitle="dialogTitle"  :dialogText="dialogText" @onConfirm="onConfirm" @onCancel="onCancel" ></confirm-dialog>

    </v-card>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import axios from 'axios'
import {validations} from './../../utils/validations'
import ConfirmDialog from './../../components/ConfirmDialog.vue'
export default {
  props: ['values'],
  data: (vm) => ({
    rol: {
      name: '',
      description: '',
      permissions: [],
      removed: false
    },
    viewPermission: [],
    headers: [
      {text: 'Nombre', align: 'left', sortable: true, value: 'name'},
      {text: 'Acciones', value: 'name', sortable: false}
    ],
    valid: false,
    rules: validations,
    modalTitle: 'Agregar Permisos',
    modalText: 'Seleccione un permiso para agregar al rol',
    addRestfulModal: false,
    service: null,
    services: [],
    read: false,
    created: false,
    edit: false,
    drop: false,
    dialog: false,
    dialogTitle: 'Eliminar Permiso',
    dialogText: 'Desea eliminar este permiso?',
    permisodel: ''
  }),
  methods: {
    ...mapActions('restfuls', { findRestful: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.rol)
      }
    },
    setData (data) {
      let obj = Object.assign({}, data)
      this.rol = obj
    },
    addService () {
      this.addRestfulModal = true
    },
    editService (data) {
      this.addRestfulModal = true
      this.service = data
      let matches = this.rol.permissions.filter(s => s.includes(this.service))
      this.loadPermissionsSave(matches)
      this.modifyPermissions()
    },
    loadPermissionsSave (matches) {
      this.clearSelectPermissions()
      const read = 'get'
      const create = 'create'
      const update = 'update'
      const drop = 'remove'
      let readPermissions = matches.filter(s => s.includes(read))
      if (readPermissions.length > 0) {
        this.read = true
      }
      let createPermissions = matches.filter(s => s.includes(create))
      if (createPermissions.length > 0) {
        this.created = true
      }
      let updatePermissions = matches.filter(s => s.includes(update))
      if (updatePermissions.length > 0) {
        this.edit = true
      }
      let deletePermissions = matches.filter(s => s.includes(drop))
      if (deletePermissions.length > 0) {
        this.drop = true
      }
    },
    cancelAddPermiso () {
      this.addRestfulModal = false
    },
    modifyPermissions () {
      let matches = this.rol.permissions.filter(s => s.includes(this.service))
      if (matches.length > 0) {
        let that = this
        matches.forEach(function (element) {
          that.rol.permissions = that.rol.permissions.filter(function (item) {
            return item !== element
          })
        })
      }
      return this.rol.permissions
    },
    savePermissions () {
      this.rol.permissions = this.modifyPermissions()
      let permissions = []
      if (this.read === true) {
        permissions = permissions.concat(this.buildReadPermissions(this.service))
      }

      if (this.created === true) {
        permissions = permissions.concat(this.buildCreatePermissions(this.service))
      }

      if (this.edit === true) {
        permissions = permissions.concat(this.buildUpdatePermissions(this.service))
      }

      if (this.drop === true) {
        permissions = permissions.concat(this.buildRemovePermissions(this.service))
      }
      this.rol.permissions = this.rol.permissions.concat(permissions)
      this.clear()
    },
    buildReadPermissions (serviceName) {
      let permissionRead = [serviceName + ':find', serviceName + ':get']
      return permissionRead
    },
    buildCreatePermissions (serviceName) {
      let permissionCreate = [serviceName + ':create']
      return permissionCreate
    },
    buildUpdatePermissions (serviceName) {
      let permissionUpdate = [serviceName + ':update', serviceName + ':patch']
      return permissionUpdate
    },
    buildRemovePermissions (serviceName) {
      let permissionUpdate = [serviceName + ':remove']
      return permissionUpdate
    },
    clear () {
      this.service = ''
      this.module = null
      this.addRestfulModal = false
      this.clearSelectPermissions()
    },
    clearSelectPermissions () {
      this.read = false
      this.created = false
      this.edit = false
      this.drop = false
    },
    remove (element) {
      this.dialogTitle = 'Eliminar este permiso : ' + element.module
      this.dialog = true
      this.permisodel = element._permissions_id
    },
    onConfirm () {
      this.rol.permissions.splice(this.rol.permissions.findIndex(p => p._permissions_id === this.permisodel), 1)
      this.setSnackMessage('Permiso Eliminado')
      this.setShowSnack(true)
      this.dialog = false
    },
    onCancel () {
      this.permisodel = ''
      this.dialog = false
    }
  },
  watch: {
    values: function (dat) {
      this.setData(dat)
    }
  },
  computed: {
    ...mapGetters('restfuls', {findRestfulInStore: 'find'}),
    ...mapState('auth', { accessToken: 'accessToken' }),
    ...mapState(['currentEnv']),
    getServices () {
      return this.services
    },
    getViewPermissions () {
      let that = this
      this.rol.permissions.forEach(function (element) {
        let array = element.split(':')
        let name = array[0]
        if (!that.viewPermission.includes(name)) {
          that.viewPermission.push(name)
        }
      })
      return this.viewPermission
    }
  },
  created () {
    let axiosIntance = axios.create({baseURL: this.currentEnv})
    let that = this
    axiosIntance.defaults.headers.common['Content-Type'] = 'application/json'
    axiosIntance.get('/restfuls').then(res => {
      that.services = res.data.services
    })
    this.clear()
  },
  mounted () {},
  components: {ConfirmDialog}
}
</script>

<style>

</style>
