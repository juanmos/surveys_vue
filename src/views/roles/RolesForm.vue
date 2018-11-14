<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs6>
            <v-form
            v-model="valid"
            @submit.prevent="sendData"
            @keydown.prevent.enter
            >
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

                <v-btn  small class="blue" @click.native="addService()">
                  <v-icon>add</v-icon>Agregar Permiso
                </v-btn>
                  &nbsp;
                <v-btn type="submit" :disabled="!valid"  small color="info">Guardar Rol</v-btn>
            </v-form>
          </v-flex>
          <!-- <v-flex xs12 v-if="rol.permissions && rol.permissions.length>0">
              <v-list class="transparent elevation-0" two-line >
                <v-list-tile avatar ripple v-for="(item, index) in rol.permissions"
                v-if="item !== null && item !== undefined" v-bind:key="index" class="grey lighten-2 mt-2 mb-2 " >
                    <v-list-tile-content dark >
                      <v-list-tile-title class="heading blue--text">{{ item}}
                      </v-list-tile-title>
                      <v-list-tile-sub-title class="grey--text text--darken-4">
                          <v-container fluid>
                            <v-layout row wrap>
                              <v-list-tile-content dark>

                              </v-list-tile-content>
                              <v-flex xs12 sm3>
                                <v-list-tile-title class="heading blue--text">
                                  <v-icon v-if = "item.read == 'true'"  color="success">done_outline</v-icon>
                                  <v-icon v-else  color="error">cancel</v-icon>
                                  Leer
                                </v-list-tile-title>
                              </v-flex>
                              <v-flex xs6 sm3>
                                 <v-list-tile-title class="heading blue--text">
                                  <v-icon v-if = "item.create == 'true'"  color="success">done_outline</v-icon>
                                  <v-icon v-else  color="error">cancel</v-icon>
                                  Crear
                                </v-list-tile-title>
                              </v-flex>
                              <v-flex xs6 sm3>
                                <v-list-tile-title class="heading blue--text">
                                  <v-icon v-if = "item.update == 'true'"  color="success">done_outline</v-icon>
                                  <v-icon v-else  color="error">cancel</v-icon>
                                  Editar
                                </v-list-tile-title>
                              </v-flex>
                              <v-flex xs6 sm3>
                                 <v-list-tile-title class="heading blue--text">
                                  <v-icon v-if = "item.drop == 'true'"  color="success">done_outline</v-icon>
                                  <v-icon v-else  color="error">cancel</v-icon>
                                  Eliminar
                                </v-list-tile-title>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn color="red" fab small class="navy" @click.native="remove(item)">
                        <v-icon color="white"  >drop</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
              </v-list>
          </v-flex> aqui -->

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
                              <v-list-tile @click="edita(props.item._id)">
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
                        <v-select
                          label="Servicios"
                          v-model="service"
                          :items="getServices"
                          item-text="name"
                          item-value="_id"
                          persistent-hint
                          return-object
                          single-line
                          box
                        ></v-select>
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
                  <v-btn class="green--text darken-1" flat="flat" @click.native="savePermiso">Agregar</v-btn>
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
import {mapActions, mapGetters} from 'vuex'
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
    service: {},
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
    cancelAddPermiso () {
      this.addRestfulModal = false
    },
    savePermiso () {
      let permissions = []
      /* state.permisorol.push({
        '_permissions_id': this.service._id,
        'service': this.service.name,
        'read': this.read,
        'create': this.created,
        'update': this.edit,
        'drop': this.drop,
        'removed': false
    }) */
      if (this.read === true) {
        permissions = permissions.concat(this.buildReadPermissions(this.service.name))
      }

      if (this.created === true) {
        permissions = permissions.concat(this.buildCreatePermissions(this.service.name))
      }

      if (this.edit === true) {
        permissions = permissions.concat(this.buildUpdatePermissions(this.service.name))
      }

      if (this.drop === true) {
        permissions = permissions.concat(this.buildRemovePermissions(this.service.name))
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
      this.service = { module: '', _id: '' }
      this.module = null
      this.read = false
      this.created = false
      this.edit = false
      this.drop = false
      this.addRestfulModal = false
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
    getServices () {
      return this.findRestfulInStore({query: {removed: false}}).data
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
    this.findRestful({ query: {removed: false} }).then(response => {
    })
  },
  mounted () {},
  components: {ConfirmDialog}
}
</script>

<style>

</style>
