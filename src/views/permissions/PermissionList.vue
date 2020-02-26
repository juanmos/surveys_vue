<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Permisos listado</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="getPermission"
                  hide-actions
                  item-key="module"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">

                      <td>
                        <v-edit-dialog
                          :return-value.sync="props.item.module"
                          lazy
                          @save="edit(props.item.module, props.item, 'module')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.module }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.module"
                            label="Editar Nombre"
                            single-line
                            counter
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
                      <td>
                        <v-edit-dialog
                          :return-value.sync="props.item.description"
                          lazy
                          @save="edit(props.item.description, props.item, 'description')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.description }}
                          <v-text-field
                            slot="input"
                            v-model="props.item.description"
                            label="Editar Descripción"
                            single-line
                            counter
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>
                       <td>
                        <v-edit-dialog
                          :return-value.sync="props.item.url"
                          lazy
                          @save="edit(props.item.url, props.item, 'url')"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                        > {{ props.item.url}}
                          <v-text-field
                            slot="input"
                            v-model="props.item.url"
                            label="Editar Descripción"
                            single-line
                            counter
                          ></v-text-field>
                        </v-edit-dialog>
                      </td>

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
                            <v-list-tile @click="del(props.item)">
                              <v-list-tile-title>Eliminar</v-list-tile-title>
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
          text: 'Modulo',
          align: 'left',
          sortable: true,
          value: 'module'
        },
        {
          text: 'Descripción',
          value: 'description',
          sortable: false
        },
        { text: 'Url',
          value: 'url',
          sortable: false
        },
        { text: 'Acciones',

          sortable: false
        }
      ],
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      rules: validations,
      message: '',
      showMsg: false,
      msgType: 'error',
      page: 1,
      limit: 10,
      total: 1,
      loaded: false,
      Permission: [],
      query: {},
      dialog: false
    }
  },
  methods: {
    ...mapActions('permission', { findPermission: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    goToNew () {
      this.$router.push('/new-permission')
    },
    edit (val, elem, field) {
      const {Permission} = this.$FeathersVuex
      let permisos = new Permission(elem)
      permisos[field] = val
      permisos.patch().then((result) => {
        this.getData()
        this.setSnackMessage('Permiso Editado')
        this.setShowSnack(true)
      })
    },
    del (element) {
      const {Permission} = this.$FeathersVuex
      let permisos = new Permission(element)
      permisos.removed = true
      permisos.patch().then((result) => {
        this.getData()
        this.setSnackMessage('Permiso Eliminado')
        this.setShowSnack(true)
      })
    },
    save (val) {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
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
      console.log('Dialog closed', val)
    },
    getData () {
      this.findPermission({query: {removed: false, $skip: 0}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.permission = response.data
        console.log('estas son los roles', this.permission)
      })
    }
  },
  computed: {
    ...mapState('permission', {loading: 'isFindPending'}),
    ...mapState('permission', { paginationVal: 'pagination' }),
    ...mapGetters('permission', {findPermissionsInStore: 'find'}),
    getPermission () {
      return this.findPermissionsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
      this.findPermission({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findPermission({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.permission = response.data
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>

</style>
