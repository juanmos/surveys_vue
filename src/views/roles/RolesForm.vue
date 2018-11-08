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
                  v-model="roles.code"
                  :rules="rules.nameRules"
                  label="Codigo"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="roles.name"
                  :rules="rules.nameRules"
                  label="Nombre"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                 <v-text-field
                  v-model="roles.description"
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
           <v-flex xs6 v-if="roles.permissionrol && roles.permissionrol.length>0">
              <v-list class="transparent elevation-0" two-line >
                <v-list-tile avatar ripple v-for="(item, index) in roles.permissionrol"
                v-if="item !== null && item !== undefined" v-bind:key="index" class="grey lighten-2 mt-2 mb-2 " >
                    <v-list-tile-content dark >
                      <v-list-tile-title class="heading blue--text">{{ item.module}}
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
                                  <v-icon v-if = "item.delete == 'true'"  color="success">done_outline</v-icon>
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
                        <v-icon color="white"  >delete</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
              </v-list>
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
                                v-model="readadd"
                                  label="Leer"
                                ></v-checkbox>
                              </v-flex>
                              <v-flex xs6 sm3>
                                <v-checkbox
                                v-model="crearadd"
                                  label="Crear"
                                ></v-checkbox>
                              </v-flex>
                              <v-flex xs6 sm3>
                                <v-checkbox
                                v-model="editaradd"
                                  label="Editar"
                                ></v-checkbox>
                              </v-flex>
                              <v-flex xs6 sm3>
                                <v-checkbox
                                v-model="eliminaradd"
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
let state = {
  permisorol: []
}
export default {
  data: (vm) => ({
    roles: {
      code: '',
      name: '',
      description: '',
      permissionrol: {
        '_permissions_id': '',
        'module': '',
        'read': '',
        'create': '',
        'update': '',
        'delete': '',
        'removed': ''
      },
      removed: false
    },
    valid: false,
    rules: validations,
    modalTitle: 'Agregar Permisos',
    modalText: 'Seleccione un permiso para agregar al rol',
    addRestfulModal: false,
    service: { module: '', _id: '' },
    readadd: false,
    crearadd: false,
    editaradd: false,
    eliminaradd: false,
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
        this.$emit('dataSubmited', this.roles)
      }
    },
    addService () {
      this.addRestfulModal = true
    },
    cancelAddPermiso () {
      this.addRestfulModal = false
    },
    savePermiso () {
      state.permisorol.push({
        '_permissions_id': this.service._id,
        'module': this.service.module,
        'read': this.readadd.toString(),
        'create': this.crearadd.toString(),
        'update': this.editaradd.toString(),
        'delete': this.eliminaradd.toString(),
        'removed': false
      })

      this.clear()
    },
    clear () {
      this.roles.permissionrol = state.permisorol
      this.service = { module: '', _id: '' }
      this.module = null
      this.readadd = false
      this.crearadd = false
      this.editaradd = false
      this.eliminaradd = false
      this.addRestfulModal = false
    },
    remove (element) {
      this.dialogTitle = 'Eliminar este permiso : ' + element.module
      this.dialog = true
      this.permisodel = element._permissions_id
    },
    onConfirm () {
      this.roles.permissionrol.splice(this.roles.permissionrol.findIndex(p => p._permissions_id === this.permisodel), 1)
      this.setSnackMessage('Permiso Eliminado')
      this.setShowSnack(true)
      this.dialog = false
    },
    onCancel () {
      this.permisodel = ''
      this.dialog = false
    }
  },
  computed: {
    ...mapGetters('restfuls', {findRestfulInStore: 'find'}),
    getServices () {
      return this.findRestfulInStore({query: {removed: false}}).data
    }
  },
  created () {
    this.findRestful({ query: {removed: false} }).then(response => {
    })
  },
  mounted () {
    if (this.$route.params.id) {
    } else {
      state = {
        permisorol: []
      }
    }
  },
  components: {ConfirmDialog}
}
</script>

<style>

</style>
