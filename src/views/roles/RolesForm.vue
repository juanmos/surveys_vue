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
                  required
                ></v-text-field>

                <v-btn  small class="blue" @click.native="addpermission()">
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
                      <v-list-tile-title class="heading blue--text">{{ item._permissions_id }}
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
                         <!-- ${{ item.read }} -->
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn fab small class="navy" @click.native="remove(item)">
                        <v-icon v-bind:class="[item.active ? 'teal--text': 'grey--text']">delete</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-flex>

            <v-dialog v-model="addPermissionModal" width="700" persistent>
              <v-card>
                <v-card-title>{{modalTitle}}</v-card-title>
                <v-card-text>
                  <v-container fluid grid-list-md>
                    <v-layout row wrap>
                      <v-flex xs12 md6>
                        <v-select
                          label="Permisos"
                           v-model="permissionId"
                          :items="getPermissions"
                          item-text="module"
                          item-value="_id"
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
    </v-card>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {validations} from './../../utils/validations'
const state = {
  permisorol: []
}
export default {
  data: (vm) => ({
    roles: {
      code: '',
      name: '',
      description: '',
      permissionrol: '',
      removed: false
    },
    valid: false,
    rules: validations,
    modalTitle: 'Agregar Permisos',
    modalText: 'Seleccione un permiso para agregar al rol',
    addPermissionModal: false,
    dialog: false,
    permissionId: null,
    readadd: false,
    crearadd: false,
    editaradd: false,
    eliminaradd: false
  }),
  methods: {
    ...mapActions('permission', { findPermissions: 'find' }),
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.roles)
      }
    },
    addpermission () {
      this.addPermissionModal = true
    },
    cancelAddPermiso () {
      this.addPermissionModal = false
    },
    savePermiso () {
      //  console.log(this.readadd.toString())
      state.permisorol.push({
        '_permissions_id': this.permissionId,
        'read': this.readadd.toString(),
        'create': this.crearadd.toString(),
        'update': this.editaradd.toString(),
        'delete': this.eliminaradd.toString()
      })
      this.roles.permissionrol = state.permisorol
      this.permissionId = null
      this.readadd = false
      this.crearadd = false
      this.editaradd = false
      this.eliminaradd = false
      this.addPermissionModal = false
    }
  },
  computed: {
    ...mapGetters('permission', {findPermissionsInStore: 'find'}),
    getPermissions () {
      return this.findPermissionsInStore({query: {removed: false}}).data
    }
  },
  created () {
    this.findPermissions({ query: {removed: false} }).then(response => {
    })
  }

}
</script>

<style>

</style>
