<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Roles de Usuarios</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="getRoles"
                  hide-actions
                  item-key="name"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td class="text-xs-left">
                        {{ props.item.code }}
                      </td>
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
import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      headers: [
        {
          text: 'Codigo',
          align: 'left',
          sortable: false,
          value: 'code'
        },
        { text: 'Nombre',
          value: 'name',
          sortable: true
        },
        {
          text: 'Descripción',
          value: 'description',
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
      rules: validations,
      message: '',
      showMsg: false,
      msgType: 'error',
      page: 1,
      limit: 10,
      total: 1,
      loaded: false,
      roles: [],
      query: {},
      dialog: false
    }
  },
  methods: {
    ...mapActions('roles', { findRoles: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    goToNew () {
      this.$router.push('/new-roles')
    },
    edit (val, elem, field) {
      const {Role} = this.$FeathersVuex
      const roles = new Role(elem)
      roles[field] = val
      roles.patch().then((result) => {
        this.getData()
        this.setSnackMessage('Rol Editado')
        this.setShowSnack(true)
      })
    },
    del (element) {
      const {Role} = this.$FeathersVuex
      const roles = new Role(element)
      roles.removed = true
      roles.patch().then((result) => {
        this.getData()
        this.setSnackMessage('Rol Eliminado')
        this.setShowSnack(true)
      })
    },
    save (val) {
      console.log(val)
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
      this.findRoles({query: {removed: false, $skip: 0}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.roles = response.data
        console.log('estas son los roles', this.roles)
      })
    }
  },
  computed: {
    ...mapState('roles', {loading: 'isFindPending'}),
    ...mapState('roles', { paginationVal: 'pagination' }),
    ...mapGetters('roles', {findRolesInStore: 'find'}),
    getRoles () {
      return this.findRolesInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
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
      this.findRoles({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.findRoles({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.roles = response.data
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>

</style>
